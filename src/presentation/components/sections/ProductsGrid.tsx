import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

interface Product {
  id: string;
  href: string;
  image: StaticImageData;
  category: string;
  name: string;
  price: string;
}

interface ProductsGridProps {
  title?: string;
  description?: string;
  products?: Product[];
  accentColor?: string;
  showAccent?: boolean;
  accentStyle?: 'border' | 'background';
}

export function ProductsGrid({
  title = 'Essencial no estilo',
  description = 'Por trás de cada estilo, há uma concepção única, uma inspiração indivídual que define cada detalhe, refletindo a essência de quem o concebe.',
  products = [],
  showAccent = true,
}: ProductsGridProps) {

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          {title}
        </h2>
        {showAccent && (
          <div className={`flex-1 max-w-full rounded bg-gradient-to-r from-zinc-950 via-green-500 to-zinc-950 h-1`}></div>
        )}
      </div>
      <p className="text-sm sm:text-base text-zinc-400 mb-8 sm:mb-12 max-w-md">
        {description}
      </p>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={product.href} className="group flex flex-col">
            <div className="relative h-64 sm:h-72 lg:h-80 rounded-lg bg-zinc-200 overflow-hidden mb-4">
              <Image
                src={product.image}
                fill
                quality={90}
                placeholder="blur"
                loading="lazy"
                alt={product.name}
                className="object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 2rem), calc((100vw - 8rem) / 3)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-yellow-500 tracking-widest">
                {product.category}
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-gray-200 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm sm:text-base font-bold text-white">
                {product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
