import Image from 'next/image';
import Link from 'next/link';
import logo from '@/presentation/assets/logo.svg';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import Input from '@presentation/components/forms/Input';

export function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <Link href={'/'}>
          <Image src={logo} width={114} height={40} alt="Logo Fates" />
        </Link>
        <form className="flex w-[20em] items-center gap-3 rounded-full bg-zinc-900 px-5 py-3 ring-zinc-700">
          <MagnifyingGlassIcon className="size-5 text-zinc-500" />
          <Input
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="size-4" />
          <span className="text-sm">Cart (0)</span>
        </div>
        <div className="w-px h-4 bg-zinc-700 rounded-full"></div>
        <Link href={'/'} className="flex items-center gap-2">
          {' '}
          <span className="text-sm hover:underline">Account</span>
          <UserCircleIcon className="size-6" />
        </Link>
      </div>
    </div>
  );
}
