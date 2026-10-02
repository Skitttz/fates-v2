import { Link } from '@/presentation/components/navigation';
import { buttonVariants } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { formatCurrency } from '@/presentation/helpers';
import { ORDER_CONFIRMATION } from './constants';
import { OrderConfirmationProps } from './types';

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <section
      aria-live="polite"
      className="flex flex-col items-center gap-12 border-2 border-dashed border-street-lime/60 px-6 py-20 text-center"
    >
      <span className="animate-stamp border-4 border-street-lime px-6 py-3 font-display text-4xl uppercase text-street-lime sm:text-6xl">
        {ORDER_CONFIRMATION.title}
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-zinc-300">
          {ORDER_CONFIRMATION.code}{' '}
          <strong data-testid="order-code" className="font-marker text-xl text-street-yellow">
            {order.code}
          </strong>
        </p>
        <p className="text-zinc-400">
          {ORDER_CONFIRMATION.total} {formatCurrency(order.total)}
        </p>
        <p className="text-xs text-zinc-500">{ORDER_CONFIRMATION.hint}</p>
      </div>
      <Link href={ROUTES.PRODUCTS} className={buttonVariants({ size: 'lg' })}>
        {ORDER_CONFIRMATION.action}
      </Link>
    </section>
  );
}
