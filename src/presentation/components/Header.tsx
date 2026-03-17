import Image from 'next/image';
import Link from 'next/link';
import logo from '@/presentation/assets/logo.svg';
import {
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';

export function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <Link href={'/'}>
          <Image src={logo} width={114} height={40} alt="Logo Fates" />
        </Link>
      </div>
      <div className='flex gap-5 font-medium text-zinc-300'>
        <Link href={'/'}>Home</Link>
        <div className="w-px h-6 bg-zinc-700"></div>
        <Link href={'/produtos'}>Produtos</Link>
        <div className="w-px h-6 bg-zinc-700"></div>
        <Link href={'/contato'}>Contato</Link>
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
