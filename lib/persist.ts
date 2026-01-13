import type { Diary } from '@/features/diary/diarySlice';
import type { RootState } from '@/lib/store';

const STORAGE_KEY = 'diary-app:redux:v1';

const UNSPLASH_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1526401485004-2fda9f2f5f4c?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&h=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=800&q=80',
];

function hashStringToIndex(input: string, modulo: number) {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash) % modulo;
}

function buildUnsplashImageUrl(seed: string) {
  const index = hashStringToIndex(seed, UNSPLASH_IMAGE_URLS.length);
  return UNSPLASH_IMAGE_URLS[index];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

export function loadPersistedState(): Partial<RootState> | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return undefined;

    const state = parsed as Partial<RootState>;

    const diarySlice = state.diary;
    const diariesUnknown = asRecord(diarySlice).diaries;

    if (Array.isArray(diariesUnknown)) {
      const fixed: Diary[] = diariesUnknown.map((item) => {
        const record = asRecord(item);

        const id = typeof record.id === 'string' ? record.id : 'legacy';
        const title = typeof record.title === 'string' ? record.title : 'diary';
        const content =
          typeof record.content === 'string' ? record.content : '';
        const createdAt =
          typeof record.createdAt === 'string'
            ? record.createdAt
            : new Date(0).toISOString();
        const updatedAt =
          typeof record.updatedAt === 'string'
            ? record.updatedAt
            : new Date(0).toISOString();
        const rawImageUrl =
          typeof record.imageUrl === 'string' ? record.imageUrl : '';

        const imageUrl =
          rawImageUrl && !rawImageUrl.includes('source.unsplash.com')
            ? rawImageUrl
            : buildUnsplashImageUrl(id);

        return { id, title, content, imageUrl, createdAt, updatedAt };
      });

      const selectedIdRaw = asRecord(diarySlice).selectedId;

      state.diary = {
        diaries: fixed,
        selectedId: typeof selectedIdRaw === 'string' ? selectedIdRaw : null,
      };
    }

    return state;
  } catch {
    return undefined;
  }
}

export function savePersistedState(state: RootState) {
  if (typeof window === 'undefined') return;

  try {
    const minimal: Partial<RootState> = {
      diary: {
        diaries: state.diary.diaries,
        selectedId: state.diary.selectedId,
      },
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
  } catch {
    // ignore quota/serialization errors
  }
}

export function setupPersistence(store: {
  getState: () => RootState;
  subscribe: (listener: () => void) => () => void;
}) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const unsubscribe = store.subscribe(() => {
    if (timeout) return;
    timeout = setTimeout(() => {
      timeout = null;
      savePersistedState(store.getState());
    }, 250);
  });

  return () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    unsubscribe();
  };
}
