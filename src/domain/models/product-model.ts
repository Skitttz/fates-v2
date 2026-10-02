export type ProductModel = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  material: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: string[];
  tag?: string;
};
