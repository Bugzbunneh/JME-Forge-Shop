import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { createCheckoutSession } from "../api/checkout";
import { fetchProductBySlug } from "../api/products";
import ProductGallery from "../components/ProductGallery";
import { useSeo } from "../hooks/useSeo";
import { getProductJsonLd, getProductMeta } from "../seo/seo";
import { useAuthStore } from "../stores/useAuthStore";
import type { Product } from "../types/product";

const BuyButton = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: () => createCheckoutSession(product.id),
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
    },
  });

  const handleClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    mutation.mutate();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={mutation.isPending}
        className="mt-6 w-full border border-white py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mutation.isPending ? "Redirecting to checkout…" : "Buy now"}
      </button>
      {mutation.isError && (
        <p className="mt-2 text-sm text-red-400">
          Something went wrong starting checkout. Please try again.
        </p>
      )}
    </>
  );
};

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

  return <ProductDetailContent product={product} />;
};

const ProductDetailContent = ({ product }: { product: Product }) => {
  useSeo(getProductMeta(product));

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd(product)) }}
      />

      <p className="text-xs uppercase tracking-widest text-neutral-500">
        <Link to="/products" className="hover:text-white">
          Products from the forge
        </Link>
        <span className="mx-2">›</span>
        {product.name}
      </p>

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <ProductGallery
          slug={product.slug}
          images={product.images}
          alt={`${product.name} — handmade knife by JME Forge Shop`}
        />

        <div>
          <h1 className="text-3xl font-light tracking-tight text-white">{product.name}</h1>
          <p className="mt-3 text-xl text-neutral-300">£{product.price.toFixed(2)}</p>

          {product.soldOut ? (
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed border border-neutral-700 bg-neutral-800 py-3 text-sm uppercase tracking-widest text-neutral-500"
            >
              Sold out
            </button>
          ) : (
            <BuyButton product={product} />
          )}

          <p className="mt-8 leading-relaxed text-neutral-300">{product.description}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
