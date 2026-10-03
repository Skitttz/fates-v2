import { GetStorySource } from '@/data/protocols/story';
import { JsonStorySource } from '@/infra/story';

export const makeJsonStorySource = (): GetStorySource => new JsonStorySource();
