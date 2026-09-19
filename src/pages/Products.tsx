import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import ProductImage from "../components/ProductImage";

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-center text-3xl font-light tracking-tight text-white">
        Products from the forge
      </h1>

      {isLoading ? (
        <p className="mt-16 text-center text-neutral-500">Loading…</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
          {products?.map((product) => (
            <Link key={product.id} to={`/products/${product.slug}`} className="group block">
              <div className="relative overflow-hidden bg-neutral-800">
                <ProductImage
                  slug={product.slug}
                  images={product.images}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.soldOut && (
                  <span className="absolute bottom-2 left-2 bg-neutral-900/90 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-200">
                    Sold out
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-neutral-200">{product.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Products;
