import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/formatPrice";
import ProductImage from "./ProductImage";
import SaveButton from "./SaveButton";

interface ProductCardProps {
  product: Product;
  eager?: boolean;
}

const ProductCard = ({ product, eager = false }: ProductCardProps) => {
  const hoverImage = product.images?.[1];
  const imageDimming = product.soldOut ? "opacity-55" : "";

  return (
    <article className="group relative">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xs bg-surface">
          <ProductImage
            slug={product.slug}
            images={product.images}
            alt={`${product.name} — handmade knife by JME Forge Shop`}
            eager={eager}
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageDimming}`}
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${imageDimming}`}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {product.soldOut && (
            <span className="absolute bottom-3 left-3 rounded-xs bg-canvas/90 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.2em] text-muted uppercase backdrop-blur">
              Sold out
            </span>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="font-display text-xl leading-tight font-medium text-fg transition-colors group-hover:text-ember-strong sm:text-2xl">
            {product.name}
          </p>
          <p className="shrink-0 text-sm text-muted">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <SaveButton
        productId={product.id}
        productName={product.name}
        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-canvas/70 backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      />
    </article>
  );
};

export default ProductCard;
