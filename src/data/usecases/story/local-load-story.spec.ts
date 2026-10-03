import { describe, expect, it } from 'vitest';
import { UnexpectedError } from '@/domain/errors';
import { mockStoryModel } from '@/domain/test';
import { StorySourceSpy } from '../../test';
import { LocalLoadStory } from './local-load-story';

const makeSut = () => {
  const source = new StorySourceSpy();
  const sut = new LocalLoadStory(source);
  return { sut, source };
};

describe('LocalLoadStory', () => {
  it('reads the source once', async () => {
    const { sut, source } = makeSut();

    await sut.load();

    expect(source.callsCount).toBe(1);
  });

  it('returns the adapted story', async () => {
    const { sut } = makeSut();

    await expect(sut.load()).resolves.toEqual(mockStoryModel());
  });

  it('throws UnexpectedError when the source fails', async () => {
    const { sut, source } = makeSut();
    source.error = new Error('disk error');

    await expect(sut.load()).rejects.toThrow(UnexpectedError);
  });

  it('throws UnexpectedError when the source returns an invalid story', async () => {
    const { sut, source } = makeSut();
    source.result = { id: 'broken' };

    await expect(sut.load()).rejects.toThrow(UnexpectedError);
  });
});
