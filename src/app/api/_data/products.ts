import { RemoteProductModel } from '@/data/models';

export const PRODUCTS: RemoteProductModel[] = [
  {
    id: 1,
    slug: 'camiseta-basic-fates',
    name: 'Camiseta Basic Fates',
    description:
      'Oversized preta com o logo Fates tom sobre tom no peito. Malha pesada, caimento amplo e costura reforçada pra aguentar sessão no pico.',
    category: 'camisetas',
    material: '100% algodão fio 30.1 penteado',
    price_in_cents: 8990,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto'],
    images: ['/images/products/camiseta-basic-fates.png'],
    tag: 'DROP 01',
  },
  {
    id: 2,
    slug: 'calca-jogger-fates',
    name: 'Calça Jogger Fates',
    description:
      'Jogger de moletom flanelado com punho na barra e logo bordado na coxa. Conforto de casa com atitude de rua.',
    category: 'calcas',
    material: 'Moletom 3 cabos flanelado (50% algodão / 50% poliéster)',
    price_in_cents: 18990,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto'],
    images: ['/images/products/calca-jogger-fates.png'],
    tag: 'NEW',
  },
  {
    id: 3,
    slug: 'touca-fates',
    name: 'Touca Fates Fisherman',
    description:
      'Touca curta estilo fisherman com barra dobrada e logo bordado em vinho. Fecha o fit em qualquer estação.',
    category: 'acessorios',
    material: 'Tricô canelado 100% acrílico',
    price_in_cents: 6990,
    sizes: ['Único'],
    colors: ['Preto'],
    images: ['/images/products/touca-fates.png'],
    tag: null,
  },
  {
    id: 4,
    slug: 'sticker-pack-fates',
    name: 'Sticker Pack Fates Crew',
    description:
      'Kit com 6 adesivos da crew pra colar no shape, no poste ou no notebook. Arte autoral, cores vivas e resistência a chuva.',
    category: 'acessorios',
    material: 'Vinil com laminação fosca',
    price_in_cents: 2490,
    sizes: ['Único'],
    colors: ['Sortido'],
    images: ['/images/products/sticker-pack-fates-1.jpg', '/images/products/sticker-pack-fates-2.jpg'],
    tag: 'LIMITED',
  },
];

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export const findProducts = ({ query, category }: { query?: string; category?: string }) => {
  const term = normalize(query?.trim() ?? '');

  return PRODUCTS.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesQuery =
      !term ||
      [product.name, product.description, product.category].some((field) =>
        normalize(field).includes(term),
      );
    return matchesCategory && matchesQuery;
  });
};

export const findProductBySlug = (slug: string) =>
  PRODUCTS.find((product) => product.slug === slug);

export const simulateLatency = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
