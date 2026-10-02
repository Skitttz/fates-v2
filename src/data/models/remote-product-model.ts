export type RemoteProductModel = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  material: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: string[];
  tag: string | null;
  createdAt: string;
};
