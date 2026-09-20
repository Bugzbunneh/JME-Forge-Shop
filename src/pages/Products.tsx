import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import ProductImage from "../components/ProductImage";
import { useSeo } from "../hooks/useSeo";
import { productsMeta } from "../seo/seo";

const Products = () => {
  useSeo(productsMeta);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-center text-3xl font-light tracking-tight text-white">
        Handmade Knives, Swords &amp; Karambits
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-400">
        Every knife, sword, and karambit below is fully custom and hand-forged to order by Josh
        Ellison in Chorley, Lancashire — from everyday kitchen knives to one-of-a-kind pieces.
      </p>

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
                  alt={`${product.name} — handmade knife by JME Forge Shop`}
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
