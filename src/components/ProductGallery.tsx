import { useState } from "react";
import PlaceholderImage from "./PlaceholderImage";

interface ProductGalleryProps {
  slug: string;
  images?: string[];
  alt: string;
}

const ProductGallery = ({ slug, images, alt }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images !== undefined && images.length > 0;
  const totalImages = hasImages ? images.length : 1;
  const activeImage = hasImages ? images[activeIndex] : undefined;

  const showPrevious = () => setActiveIndex((index) => (index === 0 ? totalImages - 1 : index - 1));
  const showNext = () => setActiveIndex((index) => (index === totalImages - 1 ? 0 : index + 1));

  return (
    <div>
      <div className="relative bg-neutral-800">
        {activeImage ? (
          <img src={activeImage} alt={alt} className="aspect-square w-full object-cover" />
        ) : (
          <PlaceholderImage seed={slug} className="aspect-square w-full object-cover" />
        )}

        {hasImages && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous image"
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-neutral-900/70 px-3 py-2 text-white hover:bg-neutral-900"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-neutral-900/70 px-3 py-2 text-white hover:bg-neutral-900"
            >
              ›
            </button>
          </>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-neutral-500">
        Image {activeIndex + 1} of {totalImages}
      </p>

      {hasImages && images.length > 1 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`h-14 w-14 overflow-hidden border ${
                index === activeIndex ? "border-white" : "border-neutral-700"
              }`}
            >
              <img
                src={image}
                alt={`${alt} — view ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
