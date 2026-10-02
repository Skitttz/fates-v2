import Link from 'next/link';
import { buttonVariants, GlitchText } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { NOT_FOUND_PAGE } from './constants';

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[100em] flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <span className="tape h-3 w-48 -rotate-6" aria-hidden="true" />
      <h1 className="font-display text-[9rem] leading-none sm:text-[14rem]">
        <GlitchText text={NOT_FOUND_PAGE.code} />
      </h1>
      <p className="font-marker text-3xl text-street-lime">{NOT_FOUND_PAGE.title}</p>
      <p className="max-w-md text-zinc-400">{NOT_FOUND_PAGE.description}</p>
      <Link href={ROUTES.PRODUCTS} className={buttonVariants({ size: 'lg' })}>
        {NOT_FOUND_PAGE.action}
      </Link>
    </div>
  );
}
