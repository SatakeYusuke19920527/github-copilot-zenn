import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ISODateString = string;

export type Diary = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

type DiaryState = {
  diaries: Diary[];
  selectedId: string | null;
};

function generateId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

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

const initialState: DiaryState = {
  diaries: [
    {
      id: 'demo',
      title: 'はじめての日記',
      content:
        'これはUI確認用のダミーデータです。右下の + から新規作成できます。',
      imageUrl: buildUnsplashImageUrl('demo'),
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  selectedId: null,
};

export const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    addDiary: {
      reducer(state, action: PayloadAction<Diary>) {
        state.diaries.unshift(action.payload);
      },
      prepare(payload: { title: string; content: string }) {
        const timestamp = new Date().toISOString();
        const id = generateId();
        const diary: Diary = {
          id,
          title: payload.title,
          content: payload.content,
          imageUrl: buildUnsplashImageUrl(id),
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        return { payload: diary };
      },
    },
    updateDiary(
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>
    ) {
      const { id, title, content } = action.payload;
      const diary = state.diaries.find((d) => d.id === id);
      if (!diary) return;

      diary.title = title;
      diary.content = content;
      diary.updatedAt = new Date().toISOString();
    },
    deleteDiary(state, action: PayloadAction<{ id: string }>) {
      state.diaries = state.diaries.filter((d) => d.id !== action.payload.id);

      if (state.selectedId === action.payload.id) {
        state.selectedId = null;
      }
    },
  },
});

export const { addDiary, updateDiary, deleteDiary } = diarySlice.actions;
export default diarySlice.reducer;
