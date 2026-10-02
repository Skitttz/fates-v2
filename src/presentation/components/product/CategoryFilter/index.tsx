import Link from 'next/link';
import { buildProductsHref } from '@/presentation/helpers';
import { cn } from '@/presentation/utils/cn';
import { CATEGORY_OPTIONS } from './constants';
import { CategoryFilterProps } from './types';

export function CategoryFilter({ query, category }: CategoryFilterProps) {
  return (
    <nav aria-label="Categorias" className="flex flex-wrap gap-2">
      {CATEGORY_OPTIONS.map((option) => {
        const isActive = option.value === category;
        return (
          <Link
            key={option.label}
            href={buildProductsHref({ query, category: option.value })}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'border-2 px-4 py-2 font-display text-xs uppercase tracking-widest transition-all',
              isActive
                ? '-rotate-2 border-black bg-street-lime text-black shadow-brutal-sm'
                : 'border-zinc-700 text-zinc-300 hover:-rotate-2 hover:border-zinc-50',
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
