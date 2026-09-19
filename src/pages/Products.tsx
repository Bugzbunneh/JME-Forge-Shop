import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import ProductImage from "../components/ProductImage";
import { useProductFilterStore } from "../stores/useProductFilterStore";

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const category = useProductFilterStore((state) => state.category);
  const setCategory = useProductFilterStore((state) => state.setCategory);
  const clear = useProductFilterStore((state) => state.clear);

  const hiddenCategories = ["Coins", "Curiosities", "Hardware"];

  const categories = products
    ? Array.from(new Set(products.map((product) => product.category))).filter(
        (item) => !hiddenCategories.includes(item),
      )
    : [];

  const visibleProducts = products
    ? category
      ? products.filter((product) => product.category === category)
      : products
    : [];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-center text-3xl font-light tracking-tight text-white">
        Products from the forge
      </h1>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
              category === item
                ? "border-white bg-white text-neutral-900"
                : "border-neutral-600 text-neutral-400 hover:border-white hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
        {category && (
          <button
            type="button"
            onClick={clear}
            className="text-xs uppercase tracking-widest text-neutral-500 underline hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="mt-16 text-center text-neutral-500">Loading…</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
          {visibleProducts.map((product) => (
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
