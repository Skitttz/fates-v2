'use client';

import { useState } from 'react';
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from '@/presentation/components/navigation';
import { ConfirmDialog } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { useAccount } from '@/presentation/contexts/account';
import { ACCOUNT_MENU, SIGN_OUT_DIALOG } from './constants';

export function AccountMenu() {
  const { account, ready, signOut } = useAccount();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!ready) return <span className="h-6 w-16" aria-hidden="true" />;

  if (!account) {
    return (
      <Link
        href={ROUTES.LOGIN}
        className="group flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-street-lime"
      >
        <span className="hidden sm:inline">{ACCOUNT_MENU.signIn}</span>
        <UserCircleIcon className="size-6 transition-transform group-hover:rotate-12" />
      </Link>
    );
  }

  const firstName = account.name.split(' ')[0];

  async function handleConfirm() {
    setConfirmOpen(false);
    await signOut();
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-zinc-300 sm:inline">
        {ACCOUNT_MENU.greeting}{' '}
        <strong className="font-marker text-street-lime">{firstName}</strong>
      </span>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        aria-label={ACCOUNT_MENU.signOut}
        aria-haspopup="dialog"
        className="text-zinc-400 transition-colors hover:text-street-orange"
      >
        <ArrowRightStartOnRectangleIcon className="size-5" />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title={SIGN_OUT_DIALOG.title}
        description={SIGN_OUT_DIALOG.description}
        confirmLabel={SIGN_OUT_DIALOG.confirm}
        cancelLabel={SIGN_OUT_DIALOG.cancel}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
