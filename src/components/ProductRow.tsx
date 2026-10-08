import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductRowProps {
  products: Product[];
}

const columnClassesByCount: Record<number, string> = {
  1: "lg:max-w-xs lg:grid-cols-1",
  2: "lg:max-w-xl lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const ProductRow = ({ products }: ProductRowProps) => {
  const columnClasses = columnClassesByCount[products.length] ?? columnClassesByCount[4];

  return (
    <div className={`grid grid-cols-2 gap-x-5 gap-y-10 ${columnClasses}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductRow;
