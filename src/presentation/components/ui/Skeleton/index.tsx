import { cn } from '@/presentation/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-zinc-800', className)} />;
}
