import PlaceholderImage from "./PlaceholderImage";

interface ProductImageProps {
  slug: string;
  images?: string[];
  alt: string;
  className?: string;
}

const ProductImage = ({ slug, images, alt, className }: ProductImageProps) => {
  if (images && images.length > 0) {
    return <img src={images[0]} alt={alt} className={className} />;
  }

  return <PlaceholderImage seed={slug} className={className} />;
};

export default ProductImage;
