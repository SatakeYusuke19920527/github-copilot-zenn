'use client';

import { loadPersistedState, setupPersistence } from '@/lib/persist';
import { type AppStore, makeStore } from '@/lib/store';
import { type ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

export default function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    const preloadedState = loadPersistedState();
    storeRef.current = makeStore(preloadedState);
    setupPersistence(storeRef.current);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
