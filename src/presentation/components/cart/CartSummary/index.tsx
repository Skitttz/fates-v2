import { formatCurrency } from '@/presentation/helpers';
import { CartSummaryProps } from './types';

export function CartSummary({ subtotal, totalItems, children }: CartSummaryProps) {
  return (
    <aside
      aria-label="Resumo do pedido"
      className="sticky top-28 flex flex-col gap-6 border-2 border-zinc-50 bg-zinc-900 p-6 shadow-brutal-lime"
    >
      <h2 className="font-display text-2xl uppercase">Resumo</h2>
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-zinc-300">
          <dt>
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-zinc-300">
          <dt>Frete</dt>
          <dd className="font-marker text-street-lime">grátis no drop</dd>
        </div>
        <div className="flex justify-between border-t-2 border-dashed border-zinc-700 pt-4 font-display text-2xl uppercase">
          <dt>Total</dt>
          <dd data-testid="cart-total">{formatCurrency(subtotal)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}
