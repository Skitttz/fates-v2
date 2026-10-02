type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => unknown;
};

/** tempo máximo esperando a rota trocar antes de liberar a transição */
const MAX_TRANSITION_WAIT_MS = 1500;

let resolvePending: (() => void) | null = null;

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const supportsViewTransition = (): boolean =>
  typeof document !== 'undefined' &&
  typeof (document as ViewTransitionDocument).startViewTransition === 'function' &&
  !prefersReducedMotion();

export function resolveViewTransition(): void {
  resolvePending?.();
  resolvePending = null;
}

/** envolve uma navegação numa view transition; sem suporte, só navega */
export function startPageTransition(navigate: () => void): void {
  if (!supportsViewTransition()) {
    navigate();
    return;
  }

  resolveViewTransition();
  (document as ViewTransitionDocument).startViewTransition!(
    () =>
      new Promise<void>((resolve) => {
        resolvePending = resolve;
        navigate();
        setTimeout(resolveViewTransition, MAX_TRANSITION_WAIT_MS);
      }),
  );
}

export function smoothScrollTo(hash: string): boolean {
  const target = document.getElementById(decodeURIComponent(hash.replace(/^#/, '')));
  if (!target) return false;

  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  window.history.pushState(null, '', hash);
  return true;
}
