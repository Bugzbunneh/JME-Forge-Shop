import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductBySlug, fetchProducts } from "../api/products";
import { ArrowRightIcon, HammerIcon, LockIcon, ShareIcon, SparkIcon } from "../components/icons";
import ProductGallery from "../components/ProductGallery";
import ProductRow from "../components/ProductRow";
import SaveButton from "../components/SaveButton";
import { siteConfig } from "../config/site";
import { useBuyProduct } from "../hooks/useBuyProduct";
import { useSeo } from "../hooks/useSeo";
import { getProductJsonLd, getProductMeta } from "../seo/seo";
import { useToastStore } from "../stores/useToastStore";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/formatPrice";
import { pickRelatedProducts } from "../utils/products";
import NotFound from "./NotFound";

const RELATED_COUNT = 4;

const perks = [
  { Icon: HammerIcon, text: "Hand forged by Josh in Chorley, Lancashire" },
  { Icon: SparkIcon, text: "One of a kind — no two pieces are alike" },
  { Icon: LockIcon, text: "Secure checkout powered by Stripe" },
];

const buyButtonLabel = (isPending: boolean, isLoggedIn: boolean) => {
  if (isPending) return "Redirecting to checkout…";
  return isLoggedIn ? "Buy now" : "Log in to buy";
};

const ProductDetailSkeleton = () => (
  <div className="container-page grid gap-10 pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16" aria-hidden>
    <div className="skeleton aspect-square w-full" />
    <div className="space-y-5 pt-4">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-14 w-3/4" />
      <div className="skeleton h-8 w-24" />
      <div className="skeleton h-14 w-full" />
      <div className="skeleton h-24 w-full" />
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <NotFound
        title="Piece not found"
        message="We couldn't find that piece. It may have been removed from the collection."
      />
    );
  }

  return <ProductDetailContent product={product} />;
};

const StickyBuyBar = ({ product, visible }: { product: Product; visible: boolean }) => {
  const { buy, isPending, isLoggedIn } = useBuyProduct(product);

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 px-5 py-3 backdrop-blur-xl transition-[transform,visibility] duration-300 sm:hidden ${
        visible ? "visible translate-y-0" : "invisible translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-tight font-medium text-fg">
            {product.name}
          </p>
          <p className="text-sm text-muted">{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={buy}
          disabled={isPending}
          className="btn btn-primary shrink-0"
        >
          {buyButtonLabel(isPending, isLoggedIn)}
        </button>
      </div>
    </div>
  );
};

const ProductDetailContent = ({ product }: { product: Product }) => {
  useSeo(getProductMeta(product));

  const { buy, isPending, isError, isLoggedIn } = useBuyProduct(product);
  const showToast = useToastStore((state) => state.showToast);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsVisible, setActionsVisible] = useState(true);

  const { data: allProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const relatedProducts = pickRelatedProducts(allProducts ?? [], product.id, RELATED_COUNT);

  useEffect(() => {
    const actionsElement = actionsRef.current;
    if (!actionsElement) return;

    const actionsObserver = new IntersectionObserver(([entry]) =>
      setActionsVisible(entry.isIntersecting),
    );
    actionsObserver.observe(actionsElement);

    return () => {
      actionsObserver.disconnect();
    };
  }, []);

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: product.name, url: shareUrl });
      } catch {
        // Dismissing the native share sheet rejects the promise; nothing to recover from.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Couldn't copy the link");
    }
  };

  const showStickyBar = !product.soldOut && !actionsVisible;

  return (
    <>
      <section className="container-page pt-8 sm:pt-12">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd(product)) }}
        />

        <nav
          aria-label="Breadcrumb"
          className="text-[0.7rem] tracking-[0.2em] text-subtle uppercase"
        >
          <Link to="/products" className="transition-colors hover:text-ember">
            Shop
          </Link>
          <span className="mx-3" aria-hidden>
            /
          </span>
          <span className="text-muted">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              slug={product.slug}
              images={product.images}
              alt={`${product.name} — handmade knife by JME Forge Shop`}
              soldOut={product.soldOut}
            />
          </div>

          <div className="lg:pt-2">
            <p className="eyebrow">Hand forged · One of a kind</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] font-medium tracking-tight text-fg sm:text-6xl">
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <p className="text-3xl text-fg">{formatPrice(product.price)}</p>
              <span
                className={`rounded-full border px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] uppercase ${
                  product.soldOut
                    ? "border-line text-subtle"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {product.soldOut ? "Sold out" : "Available — 1 piece"}
              </span>
            </div>

            <p className="mt-8 leading-relaxed whitespace-pre-line text-muted">
              {product.description}
            </p>

            <div ref={actionsRef} className="mt-10">
              {product.soldOut ? (
                <>
                  <div className="card p-6">
                    <p className="font-display text-2xl font-medium text-fg">
                      Want something similar?
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Josh takes custom orders — get in touch and he&rsquo;ll build a piece to your
                      needs.
                    </p>
                    <a
                      href={siteConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline mt-5"
                    >
                      Message on Instagram
                      <ArrowRightIcon className="h-4 w-4" />
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={buy}
                    disabled={isPending}
                    className="btn btn-primary w-full py-4"
                  >
                    {buyButtonLabel(isPending, isLoggedIn)}
                  </button>
                  {isError && (
                    <p className="alert-error mt-3">
                      Something went wrong starting checkout. Please try again.
                    </p>
                  )}
                </>
              )}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <SaveButton
                  productId={product.id}
                  productName={product.name}
                  withLabel
                  className="rounded-xs border border-fg/25 px-4 py-3.5 hover:border-ember"
                />
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 rounded-xs border border-fg/25 px-4 py-3.5 text-fg transition-colors hover:border-ember hover:text-ember"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase">
                    Share
                  </span>
                </button>
              </div>
            </div>

            <ul className="mt-10 space-y-4 border-t border-line pt-8">
              {perks.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-4 text-sm text-muted">
                  <Icon className="h-5 w-5 shrink-0 text-ember" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="container-page reveal pt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Keep looking</p>
              <h2 className="section-title mt-3">More from the forge</h2>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-muted uppercase transition-colors hover:text-ember sm:inline-flex"
            >
              View all
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <ProductRow products={relatedProducts} />
          </div>
        </section>
      )}

      <StickyBuyBar product={product} visible={showStickyBar} />
    </>
  );
};

export default ProductDetail;
