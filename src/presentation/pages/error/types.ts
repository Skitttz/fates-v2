export type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
