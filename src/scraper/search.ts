import { gqlPost } from './api';
import { ALLANIME_IMG_HOST, SEARCH_GQL } from './constants';
import type { SearchResult, TranslationType } from './types';

type RawSearchResponse = {
  shows: {
    edges: Array<{
      _id: string;
      name: string;
      thumbnail?: string | null;
      availableEpisodes: { sub: number; dub: number; raw: number };
    }>;
  };
};

// Thumbnails arrive as full URLs or as bare filenames on the allanime image host.
export function resolveThumbnail(
  raw: string | null | undefined,
): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith('http')) return raw;
  return `${ALLANIME_IMG_HOST}/${raw.replace(/^\//, '')}`;
}

export async function searchAnime(
  query: string,
  mode: TranslationType = 'sub',
): Promise<SearchResult[]> {
  const data = await gqlPost<RawSearchResponse>(SEARCH_GQL, {
    search: { allowAdult: false, allowUnknown: false, query },
    limit: 40,
    page: 1,
    translationType: mode,
    countryOrigin: 'ALL',
  });
  return data.shows.edges
    .filter(e => e.availableEpisodes && e.availableEpisodes[mode] > 0)
    .map(e => ({
      id: e._id,
      name: e.name,
      thumbnail: resolveThumbnail(e.thumbnail),
      availableEpisodes: e.availableEpisodes,
    }));
}
