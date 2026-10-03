import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '@/presentation/constants/route';
import { SEARCH_LABELS, SEARCH_PLACEHOLDER } from './constants';
import { SearchFormProps } from './types';

export function SearchForm({ query, category }: SearchFormProps) {
  return (
    <form
      action={ROUTES.PRODUCTS}
      role="search"
      className="flex h-12 w-full max-w-xl border-2 border-zinc-700 bg-zinc-900 transition-colors focus-within:border-street-lime"
    >
      {category && <input type="hidden" name="category" value={category} />}
      <label htmlFor="search" className="sr-only">
        {SEARCH_LABELS.input}
      </label>
      <input
        id="search"
        name="q"
        type="search"
        defaultValue={query}
        placeholder={SEARCH_PLACEHOLDER}
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-base placeholder-zinc-500 sm:text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <button
        type="submit"
        aria-label={SEARCH_LABELS.submit}
        className="grid h-full w-14 shrink-0 place-items-center bg-street-lime text-black transition-colors hover:bg-street-yellow focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black focus-visible:ring-offset-0"
      >
        <MagnifyingGlassIcon className="size-5" />
      </button>
    </form>
  );
}
