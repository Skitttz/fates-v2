export type RemoteProductModel = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  material: string;
  price_in_cents: number;
  sizes: string[];
  colors: string[];
  images: string[];
  tag?: string | null;
};
