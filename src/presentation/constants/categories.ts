export const CATEGORIES = [
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'calcas', label: 'Calças' },
  { value: 'acessorios', label: 'Acessórios' },
] as const;

export const getCategoryLabel = (category: string): string =>
  CATEGORIES.find(({ value }) => value === category)?.label ?? category;
