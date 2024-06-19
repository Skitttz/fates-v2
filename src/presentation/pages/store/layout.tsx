import Link from 'next/link';
import { StoreLayoutProps } from './types';
import Image from 'next/image';
import ProdutoImg1 from '@@assets/mock-produto-1.png';
import ProdutoImg2 from '@@assets/mock-produto-2.png';
import ProdutoImg3 from '@@assets/mock-produto-3.png';

export default function StoreLayout({
  data,
  error,
  loading,
}: StoreLayoutProps) {
  return (
    <div>
      <div className="grid max-[53.75em] grid-cols-9 grid-rows-6 gap-6">
        <Link
          href="/"
          className="group relative col-span-6 row-span-6 roundend-lg bg-zinc-300 overflow-hidden flex justify-center items-end"
        >
          <Image
            src={ProdutoImg1}
            width={620}
            height={520}
            quality={100}
            alt="Produto 1"
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[17.5em] rounded-full border-2 border-zinc-300">
            <span className="text-sm truncate">Fates Basic Shirt</span>
            <span className="flex h-full items-center justify-center rounded-full bg-red-500 px-4 font-semibold">
              $80
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="group col-span-3 row-span-3 roundend-lg bg-zinc-300 overflow-hidden flex justify-center items-end"
        >
          <Image
            src={ProdutoImg2}
            width={320}
            height={520}
            quality={100}
            alt="Produto 2"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <Link
          href="/"
          className="group col-span-3 row-span-3 roundend-lg bg-zinc-300 overflow-hidden flex justify-center items-end"
        >
          <Image
            src={ProdutoImg3}
            width={320}
            height={520}
            quality={100}
            alt="Produto 3"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
    </div>
  );
}
