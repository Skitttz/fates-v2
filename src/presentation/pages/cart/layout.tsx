import { Link } from '@/presentation/components/navigation';
import { CartItemRow, CartSummary, OrderConfirmation } from '@/presentation/components/cart';
import { EmptyState } from '@/presentation/components/feedback';
import { Button, buttonVariants, GlitchText, Skeleton } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { CART_EMPTY, CART_PAGE } from './constants';
import { CartLayoutProps } from './types';

export default function CartLayout({
  items,
  ready,
  subtotal,
  totalItems,
  isAuthenticated,
  status,
  onRemove,
  onQuantityChange,
  onCheckout,
}: CartLayoutProps) {
  const isProcessing = status.type === 'processing';
  const idleLabel = isAuthenticated ? CART_PAGE.checkout : CART_PAGE.loginToCheckout;
  const checkoutLabel = isProcessing ? CART_PAGE.processing : idleLabel;

  const renderContent = () => {
    if (status.type === 'done') return <OrderConfirmation order={status.order} />;

    if (!ready) {
      return (
        <div className="flex flex-col gap-4" aria-label="Carregando carrinho">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <EmptyState
          sticker={CART_EMPTY.sticker}
          title={CART_EMPTY.title}
          description={CART_EMPTY.description}
          action={
            <Link href={ROUTES.PRODUCTS} className={buttonVariants({ size: 'lg' })}>
              {CART_EMPTY.action}
            </Link>
          }
        />
      );
    }

    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onRemove={onRemove}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </ul>

        <div>
          <CartSummary subtotal={subtotal} totalItems={totalItems}>
            <Button size="lg" onClick={onCheckout} disabled={isProcessing} className="w-full">
              {checkoutLabel}
            </Button>
            {status.type === 'error' && (
              <p role="alert" className="text-sm text-street-orange">
                {status.message}
              </p>
            )}
          </CartSummary>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto flex max-w-[100em] flex-col gap-10 px-4 py-12 sm:px-8">
      <h1 className="font-display text-6xl uppercase leading-none sm:text-8xl">
        <GlitchText text={CART_PAGE.title} />
      </h1>
      {renderContent()}
    </div>
  );
}
