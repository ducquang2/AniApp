export type TranslationType = 'sub' | 'dub';

export type SearchResult = {
  id: string;
  name: string;
  thumbnail?: string;
  availableEpisodes: { sub: number; dub: number; raw: number };
};

export type EpisodeInfo = {
  episodeString: string;
  episodeNumber: number;
};

export type ShowDetail = {
  id: string;
  name: string;
  thumbnail?: string;
  banner?: string;
  score?: number;
  genres: string[];
  description: string;
};

export type SourceEntry = {
  sourceUrl: string;
  sourceName: string;
  priority?: number;
  type?: string;
  className?: string;
};

export type PlayableLink = {
  uri: string;
  resolution?: string;
  referer?: string;
  isHls: boolean;
};
