import { gqlPost } from './api';
import { SEARCH_GQL } from './constants';
import type { SearchResult, TranslationType } from './types';

type RawSearchResponse = {
  shows: {
    edges: Array<{
      _id: string;
      name: string;
      availableEpisodes: { sub: number; dub: number; raw: number };
    }>;
  };
};

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
      availableEpisodes: e.availableEpisodes,
    }));
}
