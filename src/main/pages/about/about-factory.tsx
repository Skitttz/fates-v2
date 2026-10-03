import { About } from '@/presentation/pages/about';
import { makeLocalLoadStory } from '../../usecases';
import { AboutSoundFactory } from './about-sound-factory';

export function AboutFactory() {
  return (
    <AboutSoundFactory>
      <About loadStory={makeLocalLoadStory()} />
    </AboutSoundFactory>
  );
}
