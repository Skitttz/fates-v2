'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/presentation/components/feedback';
import { Button } from '@/presentation/components/ui';
import { ERROR_PAGE } from './constants';
import { ErrorPageProps } from './types';

export function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[100em] px-4 py-20 sm:px-8">
      <ErrorState
        message={ERROR_PAGE.message}
        action={
          <Button variant="secondary" onClick={reset}>
            {ERROR_PAGE.action}
          </Button>
        }
      />
    </div>
  );
}
