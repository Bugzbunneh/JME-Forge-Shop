import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import { ArrowRightIcon, HeartIcon } from "../components/icons";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import { useSavedHydrated } from "../hooks/useSavedHydrated";
import { useSeo } from "../hooks/useSeo";
import { useSavedStore } from "../stores/useSavedStore";

const Saved = () => {
  useSeo({
    title: "Saved pieces | JME Forge Shop",
    description: "The pieces you have saved from the forge.",
    noindex: true,
  });

  const savedIds = useSavedStore((state) => state.ids);
  const clearSaved = useSavedStore((state) => state.clearSaved);
  const storeReady = useSavedHydrated();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const savedProducts = (products ?? []).filter((product) => savedIds.includes(product.id));
  const stillLoading = !storeReady || isLoading;
  const isEmpty = !stillLoading && savedProducts.length === 0;

  return (
    <section className="container-page pt-14 pb-8 sm:pt-20">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Your shortlist</p>
          <h1 className="section-title mt-3">Saved pieces</h1>
        </div>
        {savedProducts.length > 0 && (
          <button
            type="button"
            onClick={clearSaved}
            className="text-[0.7rem] font-semibold tracking-[0.2em] text-subtle uppercase transition-colors hover:text-fg"
          >
            Clear all
          </button>
        )}
      </header>

      {stillLoading && (
        <ProductGridSkeleton
          count={3}
          className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3"
        />
      )}

      {isEmpty && (
        <div className="mt-12 flex flex-col items-center rounded-xs border border-dashed border-line px-6 py-20 text-center">
          <HeartIcon className="h-10 w-10 text-subtle" />
          <p className="mt-6 font-display text-3xl font-medium text-fg">Nothing saved yet</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Every piece is one of a kind. Tap the heart on anything you like to keep track of it
            here.
          </p>
          <Link to="/products" className="btn btn-primary mt-8">
            Browse the shop
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}

      {!stillLoading && savedProducts.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Saved;
