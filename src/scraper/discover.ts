import { gqlPost } from './api';
import { LATEST_GQL, POPULAR_GQL, SHOW_DETAIL_GQL } from './constants';
import { resolveThumbnail } from './search';
import type { SearchResult, ShowDetail, TranslationType } from './types';

type RawCard = {
  _id: string;
  name: string;
  thumbnail?: string | null;
  availableEpisodes?: { sub: number; dub: number; raw: number } | null;
};

type RawRecommendations = {
  recommendations: Array<{ anyCard: RawCard | null }> | null;
} | null;

// queryPopular and queryLatestPageStatus both return Recommendation cards;
// reduce them to the same SearchResult shape the cards/screens already consume.
function toResults(
  data: RawRecommendations,
  mode: TranslationType,
): SearchResult[] {
  return (data?.recommendations ?? [])
    .map(r => r.anyCard)
    .filter((c): c is RawCard => !!c && !!c.availableEpisodes)
    .filter(c => (c.availableEpisodes![mode] ?? 0) > 0)
    .map(c => ({
      id: c._id,
      name: c.name,
      thumbnail: resolveThumbnail(c.thumbnail),
      availableEpisodes: c.availableEpisodes!,
    }));
}

export async function getPopular(
  mode: TranslationType = 'sub',
): Promise<SearchResult[]> {
  const data = await gqlPost<{ queryPopular: RawRecommendations }>(POPULAR_GQL, {
    type: 'anime',
    size: 20,
    dateRange: 7,
    page: 1,
  });
  return toResults(data.queryPopular, mode);
}

export async function getLatestUpdates(
  mode: TranslationType = 'sub',
): Promise<SearchResult[]> {
  const data = await gqlPost<{ queryLatestPageStatus: RawRecommendations }>(
    LATEST_GQL,
    { search: { type: 'anime', size: 20 } },
  );
  return toResults(data.queryLatestPageStatus, mode);
}

// allanime descriptions are HTML with named/numeric entities — flatten to text.
function cleanDescription(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#x2014;/g, '—')
    .replace(/&#?\w+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getShowDetail(id: string): Promise<ShowDetail> {
  const data = await gqlPost<{
    show: {
      _id: string;
      name: string;
      thumbnail?: string | null;
      banner?: string | null;
      score?: number | null;
      genres?: string[] | null;
      description?: string | null;
    } | null;
  }>(SHOW_DETAIL_GQL, { showId: id });
  const s = data.show;
  if (!s) throw new Error('Show not found');
  return {
    id: s._id,
    name: s.name,
    thumbnail: resolveThumbnail(s.thumbnail),
    banner: resolveThumbnail(s.banner),
    score: s.score ?? undefined,
    genres: s.genres ?? [],
    description: cleanDescription(s.description),
  };
}
