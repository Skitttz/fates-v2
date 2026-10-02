/** recortes (png) ficam inteiros sobre o fundo claro, fotos (jpg) preenchem o card */
export const getImageFit = (src: string): 'contain' | 'cover' =>
  src.toLowerCase().endsWith('.png') ? 'contain' : 'cover';
