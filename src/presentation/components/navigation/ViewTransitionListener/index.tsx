'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { resolveViewTransition } from '@/presentation/helpers/view-transition';

/** libera a view transition pendente assim que a nova rota é renderizada */
export function ViewTransitionListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    resolveViewTransition();
  }, [pathname, searchParams]);

  return null;
}
