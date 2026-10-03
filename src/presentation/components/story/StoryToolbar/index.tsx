import { buttonVariants } from '@/presentation/components/ui';
import { TOOLBAR_LABELS } from './constants';
import { StoryToolbarProps } from './types';

export function StoryToolbar({ mode, ended, onSkip, onToggleMode }: StoryToolbarProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={onToggleMode}
        className={buttonVariants({ variant: 'outline', size: 'sm', className: 'min-h-12' })}
      >
        {mode === 'game' ? TOOLBAR_LABELS.readAsText : TOOLBAR_LABELS.backToGame}
      </button>
      {mode === 'game' && !ended && (
        <button
          type="button"
          onClick={onSkip}
          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'min-h-12' })}
        >
          {TOOLBAR_LABELS.skip}
        </button>
      )}
    </div>
  );
}
