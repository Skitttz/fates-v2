'use client';

import Image from 'next/image';
import { Link } from '@/presentation/components/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { QuantityStepper } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { formatCurrency, getImageFit } from '@/presentation/helpers';
import { cn } from '@/presentation/utils/cn';
import { CartItemRowProps } from './types';

export function CartItemRow({ item, onRemove, onQuantityChange }: CartItemRowProps) {
  return (
    <li
      data-testid="cart-item"
      className="flex animate-page-in gap-4 border-2 border-zinc-800 p-3 transition-colors hover:border-zinc-600 sm:gap-6 sm:p-4"
    >
      <Link
        href={ROUTES.PRODUCT(item.slug)}
        className="relative size-24 shrink-0 overflow-hidden bg-zinc-100 sm:size-32"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="128px"
            className={cn(
              'transition-transform duration-300 hover:scale-110',
              getImageFit(item.image) === 'contain' ? 'object-contain p-2' : 'object-cover',
            )}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={ROUTES.PRODUCT(item.slug)}
              className="font-display text-lg uppercase leading-tight transition-colors hover:text-street-lime sm:text-xl"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
              Tam. {item.size} · {item.color}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remover ${item.name} do carrinho`}
            onClick={() => onRemove(item.id)}
            className="text-zinc-500 transition-all hover:rotate-12 hover:text-street-orange"
          >
            <TrashIcon className="size-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => onQuantityChange(item.id, quantity)}
            label={`Quantidade de ${item.name}`}
          />
          <p className="font-display text-lg">{formatCurrency(item.price * item.quantity)}</p>
        </div>
      </div>
    </li>
  );
}
