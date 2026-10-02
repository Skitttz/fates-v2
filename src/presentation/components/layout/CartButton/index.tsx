'use client';

import { Link } from '@/presentation/components/navigation';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { ROUTES } from '@/presentation/constants/route';
import { useCart } from '@/presentation/contexts/cart';
import { cn } from '@/presentation/utils/cn';

export function CartButton() {
  const { totalItems, lastAddedAt } = useCart();

  return (
    <Link
      href={ROUTES.CART}
      aria-label={`Carrinho com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
      className="group relative flex items-center gap-2 border-2 border-zinc-50 px-3 py-1.5 transition-all hover:-translate-y-0.5 hover:border-street-lime hover:text-street-lime hover:shadow-brutal-lime"
    >
      <ShoppingBagIcon className="size-4 transition-transform group-hover:-rotate-12" />
      <span className="hidden font-display text-sm uppercase tracking-wider sm:inline">Cart</span>
      <span
        key={lastAddedAt}
        data-testid="cart-count"
        className={cn(
          'grid min-w-6 place-items-center bg-street-lime px-1.5 font-display text-xs text-black',
          lastAddedAt > 0 && 'animate-bump',
        )}
      >
        {totalItems}
      </span>
    </Link>
  );
}
