'use client';

import { hydrateDiaryState } from '@/features/diary/diarySlice';
import { loadPersistedState, setupPersistence } from '@/lib/persist';
import { type AppStore, makeStore } from '@/lib/store';
import { type ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

export default function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    const persisted = loadPersistedState();
    if (persisted?.diary) {
      store.dispatch(
        hydrateDiaryState({
          diaries: persisted.diary.diaries ?? [],
          selectedId: persisted.diary.selectedId ?? null,
        })
      );
    }

    const cleanup = setupPersistence(store);
    return cleanup;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
