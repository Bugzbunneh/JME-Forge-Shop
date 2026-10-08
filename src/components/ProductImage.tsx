import PlaceholderImage from "./PlaceholderImage";

interface ProductImageProps {
  slug: string;
  images?: string[];
  alt: string;
  className?: string;
  eager?: boolean;
}

const ProductImage = ({ slug, images, alt, className, eager = false }: ProductImageProps) => {
  if (images && images.length > 0) {
    return (
      <img
        src={images[0]}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    );
  }

  return <PlaceholderImage seed={slug} className={className} />;
};

export default ProductImage;
