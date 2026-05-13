export const ALLANIME_BASE = 'allanime.day';
export const ALLANIME_API = `https://api.${ALLANIME_BASE}`;
export const ALLANIME_REFR = 'https://allmanga.to';
export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0';

export const SEARCH_GQL =
  'query( $search: SearchInput $limit: Int $page: Int $translationType: VaildTranslationTypeEnumType $countryOrigin: VaildCountryOriginEnumType ) { shows( search: $search limit: $limit page: $page translationType: $translationType countryOrigin: $countryOrigin ) { edges { _id name availableEpisodes __typename } }}';

export const EPISODES_LIST_GQL =
  'query ($showId: String!) { show( _id: $showId ) { _id availableEpisodesDetail }}';

export const EPISODE_EMBED_GQL =
  'query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) { episode( showId: $showId translationType: $translationType episodeString: $episodeString ) { episodeString sourceUrls }}';

// Persisted-query SHA-256 hash for the episode query (mirrors ani-cli). Allanime's edge
// recognises this hash from the youtu-chan.com origin and skips the captcha gate.
export const EPISODE_EMBED_QUERY_HASH =
  'd405d0edd690624b66baba3068e0edc3ac90f1597d898a1ec8db4e5c43c00fec';

export const YOUTU_CHAN_ORIGIN = 'https://youtu-chan.com';
