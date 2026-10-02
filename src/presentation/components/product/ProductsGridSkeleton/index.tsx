import { Skeleton } from '@/presentation/components/ui';

export function ProductsGridSkeleton({ amount = 3 }: { amount?: number }) {
  return (
    <ul
      aria-label="Carregando produtos"
      className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: amount }, (_, index) => (
        <li key={index} className="flex flex-col gap-4">
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-3/4" />
        </li>
      ))}
    </ul>
  );
}
