import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '@/presentation/constants/route';
import { SEARCH_PLACEHOLDER } from './constants';
import { SearchFormProps } from './types';

export function SearchForm({ query, category }: SearchFormProps) {
  return (
    <form action={ROUTES.PRODUCTS} role="search" className="flex w-full max-w-xl">
      {category && <input type="hidden" name="category" value={category} />}
      <label htmlFor="search" className="sr-only">
        Buscar produtos
      </label>
      <input
        id="search"
        name="q"
        type="search"
        defaultValue={query}
        placeholder={SEARCH_PLACEHOLDER}
        className="h-12 flex-1 border-2 border-r-0 border-zinc-700 bg-zinc-900 px-4 text-sm placeholder-zinc-500 transition-colors focus:border-street-lime focus:outline-none focus-visible:ring-0"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="grid w-14 place-items-center border-2 border-black bg-street-lime text-black transition-colors hover:bg-street-yellow"
      >
        <MagnifyingGlassIcon className="size-5" />
      </button>
    </form>
  );
}
