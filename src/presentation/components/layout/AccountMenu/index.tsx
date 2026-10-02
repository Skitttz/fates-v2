'use client';

import { Link } from '@/presentation/components/navigation';
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ROUTES } from '@/presentation/constants/route';
import { useAccount } from '@/presentation/contexts/account';

export function AccountMenu() {
  const { account, ready, signOut } = useAccount();

  if (!ready) return <span className="h-6 w-16" aria-hidden="true" />;

  if (!account) {
    return (
      <Link
        href={ROUTES.LOGIN}
        className="group flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-street-lime"
      >
        <span className="hidden sm:inline">Entrar</span>
        <UserCircleIcon className="size-6 transition-transform group-hover:rotate-12" />
      </Link>
    );
  }

  const firstName = account.name.split(' ')[0];

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-zinc-300 sm:inline">
        Salve, <strong className="font-marker text-street-lime">{firstName}</strong>
      </span>
      <button
        type="button"
        onClick={signOut}
        aria-label="Sair da conta"
        className="text-zinc-400 transition-colors hover:text-street-orange"
      >
        <ArrowRightStartOnRectangleIcon className="size-5" />
      </button>
    </div>
  );
}
