'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StoryMemoryModel } from '@/domain/models/story-memory-model';
import { LoadStoryMemory, SaveStoryMemory } from '@/domain/usecases/story-memory';

type MemoryContext = {
  memory: StoryMemoryModel | null;
  remember: (memory: StoryMemoryModel) => void;
};
const Context = createContext<MemoryContext>({ memory: null, remember: () => undefined });

export function StoryMemoryProvider({
  loadMemory,
  saveMemory,
  children,
}: {
  loadMemory: LoadStoryMemory;
  saveMemory: SaveStoryMemory;
  children: ReactNode;
}) {
  const [memory, setMemory] = useState<StoryMemoryModel | null>(null);
  useEffect(() => {
    setMemory(loadMemory.load());
  }, [loadMemory]);
  const remember = useCallback(
    (next: StoryMemoryModel) => {
      saveMemory.save(next);
      setMemory(next);
    },
    [saveMemory],
  );
  const value = useMemo(() => ({ memory, remember }), [memory, remember]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useStoryMemory = () => useContext(Context);
