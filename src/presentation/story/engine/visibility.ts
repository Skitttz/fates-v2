export function watchVisibility(
  element: Element,
  onChange: (visible: boolean) => void,
): () => void {
  let onScreen = true;
  let pageVisible = !document.hidden;
  const report = () => onChange(onScreen && pageVisible);

  const observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
          onScreen = entry.isIntersecting;
          report();
        });
  observer?.observe(element);

  const handleVisibility = () => {
    pageVisible = !document.hidden;
    report();
  };
  document.addEventListener('visibilitychange', handleVisibility);
  report();

  return () => {
    observer?.disconnect();
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
