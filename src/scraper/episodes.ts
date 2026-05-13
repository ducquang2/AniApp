import { gqlPost } from './api';
import { EPISODES_LIST_GQL } from './constants';
import type { EpisodeInfo, TranslationType } from './types';

type RawEpisodesResponse = {
  show: {
    _id: string;
    availableEpisodesDetail: Record<TranslationType | 'raw', string[]>;
  };
};

export async function listEpisodes(
  showId: string,
  mode: TranslationType = 'sub',
): Promise<EpisodeInfo[]> {
  const data = await gqlPost<RawEpisodesResponse>(EPISODES_LIST_GQL, {
    showId,
  });
  const list = data.show.availableEpisodesDetail?.[mode] ?? [];
  return list
    .map(s => ({ episodeString: s, episodeNumber: Number(s) }))
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
}
