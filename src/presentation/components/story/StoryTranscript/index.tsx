import { describeBackdrop } from '@/presentation/story/backdrop-descriptions';
import { getSpeakerName } from '@/presentation/story/speakers';
import { CONDITION_LABELS, TRANSCRIPT_NOTES } from './constants';
import { StoryTranscriptProps } from './types';

export function StoryTranscript({ story }: StoryTranscriptProps) {
  return (
    <article className="flex flex-col gap-8 border-4 border-zinc-50 bg-black p-6 font-pixel text-base leading-relaxed text-zinc-100 sm:text-lg">
      {story.scenes.map((scene) => (
        <section key={scene.id} className="flex flex-col gap-2">
          {describeBackdrop(scene.backdrop) && (
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              {describeBackdrop(scene.backdrop)}
            </p>
          )}
          {scene.lines.map((line, index) => (
            <p
              key={`${scene.id}-${index}`}
              className={line.speaker ? undefined : 'italic text-zinc-300'}
            >
              {line.when && (
                <span className="text-sm text-zinc-500">{CONDITION_LABELS[line.when.ollie]} </span>
              )}
              {line.speaker && (
                <strong className="text-street-lime">{getSpeakerName(line.speaker)}: </strong>
              )}
              {line.text}
            </p>
          ))}
          {scene.interaction && scene.interaction.type !== 'choice' && (
            <p className="text-street-yellow">{TRANSCRIPT_NOTES[scene.interaction.type]}</p>
          )}
          {scene.interaction?.type === 'choice' && (
            <div className="flex flex-col gap-1">
              <p className="text-street-yellow">{scene.interaction.prompt}</p>
              <ul className="list-inside list-disc text-zinc-300">
                {scene.interaction.options.map((option) => (
                  <li key={option.id}>{`${option.label}: ${option.outcome}`}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
      <p className="text-street-lime">{story.epilogue}</p>
    </article>
  );
}
