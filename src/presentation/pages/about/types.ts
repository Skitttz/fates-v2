import { ReactNode } from 'react';
import { LoadStory } from '@/domain/usecases';

export type AboutProps = {
  loadStory: LoadStory;
};

export type AboutLayoutProps = {
  game: ReactNode;
};
