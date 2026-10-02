'use client';

import { Link } from '@/presentation/components/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button, buttonVariants, QuantityStepper } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { useCart } from '@/presentation/contexts/cart';
import { OptionGroup } from '../OptionGroup';
import { ADDED_FEEDBACK_DURATION_MS, SIZE_REQUIRED_MESSAGE } from './constants';
import { AddToCartFormProps } from './types';

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '');
  const [color, setColor] = useState(product.colors[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(false), ADDED_FEEDBACK_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [added]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!size) {
      setError(SIZE_REQUIRED_MESSAGE);
      return;
    }

    setError('');
    await addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? '',
      price: product.price,
      size,
      color,
      quantity,
    });
    setAdded(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      {product.colors.length > 0 && (
        <OptionGroup
          legend="Cor"
          name="color"
          options={product.colors}
          value={color}
          onChange={setColor}
        />
      )}

      <div className="flex flex-col gap-2">
        <OptionGroup
          legend="Tamanho"
          name="size"
          options={product.sizes}
          value={size}
          onChange={(value) => {
            setSize(value);
            setError('');
          }}
        />
        {error && (
          <span role="alert" className="text-sm font-medium text-street-orange">
            {error}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-display text-xs uppercase tracking-[0.2em] text-zinc-400">
          Quantidade
        </span>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          variant={added ? 'success' : 'primary'}
          className="sm:min-w-72"
        >
          {added ? (
            <>
              <CheckIcon className="size-5" /> Adicionado!
            </>
          ) : (
            'Adicionar ao carrinho'
          )}
        </Button>
        {added && (
          <Link
            href={ROUTES.CART}
            className={buttonVariants({ variant: 'ghost', className: 'animate-page-in' })}
          >
            Ver carrinho →
          </Link>
        )}
      </div>
    </form>
  );
}
