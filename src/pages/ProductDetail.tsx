import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useParams } from "react-router-dom";
import { fetchProductBySlug } from "../api/products";
import ProductGallery from "../components/ProductGallery";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return <p className="mx-auto max-w-5xl px-6 py-16 text-center text-neutral-500">Loading…</p>;
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-neutral-500">
        <Link to="/products" className="hover:text-white">
          Products from the forge
        </Link>
        <span className="mx-2">›</span>
        {product.name}
      </p>

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <ProductGallery slug={product.slug} images={product.images} />

        <div>
          <h1 className="text-3xl font-light tracking-tight text-white">{product.name}</h1>
          <p className="mt-3 text-xl text-neutral-300">£{product.price.toFixed(2)}</p>

          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed border border-neutral-700 bg-neutral-800 py-3 text-sm uppercase tracking-widest text-neutral-500"
          >
            {product.soldOut ? "Sold out" : "In stock"}
          </button>

          <p className="mt-8 leading-relaxed text-neutral-300">{product.description}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
