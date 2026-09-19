import { products } from "../data/products";
import type { Product } from "../types/product";

const simulateNetworkDelay = <T>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), 200));

export const fetchProducts = () => simulateNetworkDelay(products);

export const fetchProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const product = products.find((item) => item.slug === slug);
  return simulateNetworkDelay(product);
};
