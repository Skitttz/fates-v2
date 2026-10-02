'use client';

import { MouseEvent, SyntheticEvent, useEffect, useId, useRef } from 'react';
import { Button } from '../Button';
import { ConfirmDialogProps } from './types';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Esc dispara "cancel": deixa o estado do React no controle
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onCancel();
  }

  // clique fora da caixa (no backdrop) fecha
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="w-[calc(100%-2rem)] max-w-md border-2 border-zinc-50 bg-zinc-900 p-0 text-zinc-50 shadow-brutal-lime backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-dialog-in"
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="font-display text-3xl uppercase">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-sm text-zinc-400">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant="secondary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
