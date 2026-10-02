import { Skeleton } from '@/presentation/components/ui';

export function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando produto"
      className="mx-auto flex max-w-[100em] flex-col gap-8 px-4 py-10 sm:px-8"
    >
      <Skeleton className="h-3 w-64" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-14 w-4/5" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-20 w-full max-w-lg" />
          <Skeleton className="h-11 w-56" />
          <Skeleton className="h-14 w-72" />
        </div>
      </div>
    </div>
  );
}
