import { About } from '@/presentation/pages/about';
import { makeLocalLoadStory } from '../../usecases';

export function AboutFactory() {
  return <About loadStory={makeLocalLoadStory()} />;
}
