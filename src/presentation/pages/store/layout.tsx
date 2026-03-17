import { StoreLayoutProps } from './types';
import { HeroSection, ProductsGrid } from '@/presentation/components/sections';
import ProdutoImg1 from '@@assets/mock-produto-1.png';
import ProdutoImg2 from '@@assets/mock-produto-2.png';
import ProdutoImg3 from '@@assets/mock-produto-3.png';

const PRODUCTS = [
  {
    id: '1',
    href: '/',
    image: ProdutoImg1,
    category: 'PRIMAVERA',
    name: 'MOLETOM BASIC FATES',
    price: 'R$ 80',
  },
  {
    id: '2',
    href: '/',
    image: ProdutoImg2,
    category: 'PRIMAVERA',
    name: 'CAMISA BASIC FATES',
    price: 'R$ 60',
  },
  {
    id: '3',
    href: '/',
    image: ProdutoImg3,
    category: 'PRIMAVERA',
    name: 'TOUCA BASIC FATES',
    price: 'R$ 40',
  },
];

export default function StoreLayout({
  data,
  error,
  loading,
}: StoreLayoutProps) {
  return (
    <div className="w-full">
      <HeroSection />
      <ProductsGrid products={PRODUCTS} showAccent={true} />
    </div>
  );
}
