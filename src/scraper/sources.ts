import { gqlPost } from './api';
import {
  ALLANIME_API,
  ALLANIME_BASE,
  ALLANIME_REFR,
  EPISODE_EMBED_GQL,
  EPISODE_EMBED_QUERY_HASH,
  USER_AGENT,
  YOUTU_CHAN_ORIGIN,
} from './constants';
import { decodeProviderUrl } from './decoder';
import { extractSourcesFromBlob } from './decryptTobeparsed';
import type { PlayableLink, SourceEntry, TranslationType } from './types';

// Priority order. Yt-mp4 is a direct mp4 (no extra fetch). Default/S-mp4/Luf-Mp4/Ak need
// hex-decode + /clock.json. Iframe-only providers (Vid-mp4, Ok, Ss-Hls, Mp4, Vg, Fm-Hls)
// would need per-host extraction — skip for v1.
const PROVIDER_PRIORITY = ['Yt-mp4', 'Default', 'S-mp4', 'Luf-Mp4', 'Ak'];

type ClockJsonLink = {
  link: string;
  resolutionStr?: string;
  hls?: boolean;
  type?: string;
  headers?: { Referer?: string };
};

type ClockJsonResponse = { links?: ClockJsonLink[] };

// Captcha-bypass path: GET with persistedQuery extension and youtu-chan origin.
// Response shape: { data: { _m, tobeparsed: "<base64>" } }  (encrypted)
async function fetchSourcesViaPersistedQuery(
  showId: string,
  episodeString: string,
  mode: TranslationType,
): Promise<SourceEntry[] | null> {
  const variables = { showId, translationType: mode, episodeString };
  const extensions = {
    persistedQuery: { version: 1, sha256Hash: EPISODE_EMBED_QUERY_HASH },
  };
  const url =
    `${ALLANIME_API}/api?variables=${encodeURIComponent(JSON.stringify(variables))}` +
    `&extensions=${encodeURIComponent(JSON.stringify(extensions))}`;

  let json: any;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Referer: YOUTU_CHAN_ORIGIN,
        Origin: YOUTU_CHAN_ORIGIN,
      },
    });
    if (!res.ok) return null;
    json = await res.json();
  } catch {
    return null;
  }

  if (json?.errors) return null;
  if (typeof json?.data?.tobeparsed !== 'string') return null;

  try {
    return extractSourcesFromBlob(json.data.tobeparsed);
  } catch {
    return null;
  }
}

// Direct POST fallback. Captcha-gated as of mid-2026, but keep it in case the persisted
// path goes down — the cost of trying is one extra request.
async function fetchSourcesViaPost(
  showId: string,
  episodeString: string,
  mode: TranslationType,
): Promise<SourceEntry[]> {
  try {
    const data = await gqlPost<{ episode: { sourceUrls: SourceEntry[] } }>(
      EPISODE_EMBED_GQL,
      { showId, translationType: mode, episodeString },
    );
    return data.episode?.sourceUrls ?? [];
  } catch {
    return [];
  }
}

function sortByPriority(sources: SourceEntry[]): SourceEntry[] {
  return [...sources].sort((a, b) => {
    const ai = PROVIDER_PRIORITY.indexOf(a.sourceName);
    const bi = PROVIDER_PRIORITY.indexOf(b.sourceName);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

// Some providers (Yt-mp4) hand us a directly-playable URL, bypassing the /clock.json hop.
function tryDirectLink(src: SourceEntry): PlayableLink | null {
  const u = src.sourceUrl;
  if (!u) return null;
  if (u.includes('tools.fast4speed.rsvp')) {
    return {
      uri: u,
      resolution: 'auto',
      referer: ALLANIME_REFR,
      isHls: u.includes('.m3u8'),
    };
  }
  return null;
}

async function resolveEncodedSource(src: SourceEntry): Promise<PlayableLink | null> {
  if (!src.sourceUrl?.startsWith('--')) return null;
  const decoded = decodeProviderUrl(src.sourceUrl);
  if (!decoded) return null;

  const url = `https://${ALLANIME_BASE}${decoded}`;
  let json: ClockJsonResponse;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Referer: ALLANIME_REFR },
    });
    if (!res.ok) return null;
    json = await res.json();
  } catch {
    return null;
  }

  const link = json.links?.[0];
  if (!link?.link) return null;

  return {
    uri: link.link,
    resolution: link.resolutionStr,
    referer: link.headers?.Referer ?? ALLANIME_REFR,
    isHls: link.hls === true || link.link.includes('.m3u8'),
  };
}

export async function getPlayableLinks(
  showId: string,
  episodeString: string,
  mode: TranslationType = 'sub',
): Promise<PlayableLink[]> {
  let sources = await fetchSourcesViaPersistedQuery(showId, episodeString, mode);
  if (!sources || sources.length === 0) {
    sources = await fetchSourcesViaPost(showId, episodeString, mode);
  }
  if (!sources || sources.length === 0) {
    throw new Error('Allanime returned no sources (captcha or upstream error)');
  }

  const links: PlayableLink[] = [];
  for (const src of sortByPriority(sources)) {
    const direct = tryDirectLink(src);
    if (direct) {
      links.push(direct);
      continue;
    }
    const resolved = await resolveEncodedSource(src);
    if (resolved) links.push(resolved);
  }

  if (links.length === 0) {
    throw new Error('No playable source found for this episode');
  }
  return links;
}
