export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  images?: string[];
}
