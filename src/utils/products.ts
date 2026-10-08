import type { Product } from "../types/product";

export const pickFeaturedProducts = (products: Product[], count: number): Product[] => {
  const available = products.filter((product) => !product.soldOut);
  const sold = products.filter((product) => product.soldOut);
  return [...available, ...sold].slice(0, count);
};

export const pickRelatedProducts = (
  products: Product[],
  currentProductId: string,
  count: number,
): Product[] => {
  const others = products.filter((product) => product.id !== currentProductId);
  return pickFeaturedProducts(others, count);
};
