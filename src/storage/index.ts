import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'aniapp:history';
const WATCHLIST_KEY = 'aniapp:watchlist';

export type HistoryEntry = {
  showId: string;
  name: string;
  thumbnail?: string;
  episodeString: string;
  positionMs: number;
  durationMs: number;
  updatedAt: number;
};

export type WatchlistEntry = {
  showId: string;
  name: string;
  thumbnail?: string;
  subCount: number;
  addedAt: number;
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// --- Watch history (Continue Watching) ---

// History is a { [showId]: entry } map so a newer episode of the same show
// replaces the previous entry rather than stacking up.
export async function recordProgress(
  entry: Omit<HistoryEntry, 'updatedAt'>,
): Promise<void> {
  const map = await readJson<Record<string, HistoryEntry>>(HISTORY_KEY, {});
  map[entry.showId] = { ...entry, updatedAt: Date.now() };
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(map));
}

// Most-recent first, dropping all-but-finished episodes (>=95% watched).
export async function getHistory(): Promise<HistoryEntry[]> {
  const map = await readJson<Record<string, HistoryEntry>>(HISTORY_KEY, {});
  return Object.values(map)
    .filter(e => e.durationMs > 0 && e.positionMs / e.durationMs < 0.95)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

// --- Watchlist (Library) ---

export async function getWatchlist(): Promise<WatchlistEntry[]> {
  const list = await readJson<WatchlistEntry[]>(WATCHLIST_KEY, []);
  return [...list].sort((a, b) => b.addedAt - a.addedAt);
}

export async function isInWatchlist(showId: string): Promise<boolean> {
  const list = await readJson<WatchlistEntry[]>(WATCHLIST_KEY, []);
  return list.some(e => e.showId === showId);
}

// Adds or removes the show; returns the resulting membership state.
export async function toggleWatchlist(
  entry: Omit<WatchlistEntry, 'addedAt'>,
): Promise<boolean> {
  const list = await readJson<WatchlistEntry[]>(WATCHLIST_KEY, []);
  const exists = list.some(e => e.showId === entry.showId);
  const next = exists
    ? list.filter(e => e.showId !== entry.showId)
    : [...list, { ...entry, addedAt: Date.now() }];
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  return !exists;
}
