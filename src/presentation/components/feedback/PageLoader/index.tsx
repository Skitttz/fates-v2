import { ProductsGridSkeleton } from '@/presentation/components/product';
import { Skeleton } from '@/presentation/components/ui';

export function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className="mx-auto flex max-w-[100em] flex-col gap-10 px-4 py-12 sm:px-8"
    >
      <span className="animate-flicker font-display text-5xl uppercase text-zinc-700 sm:text-7xl">
        Carregando...
      </span>
      <Skeleton className="h-12 w-full max-w-xl" />
      <ProductsGridSkeleton />
    </div>
  );
}
