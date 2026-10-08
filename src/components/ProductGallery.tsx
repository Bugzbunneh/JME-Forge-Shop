import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "./icons";
import Lightbox from "./Lightbox";
import PlaceholderImage from "./PlaceholderImage";

interface ProductGalleryProps {
  slug: string;
  images?: string[];
  alt: string;
  soldOut?: boolean;
}

const SWIPE_THRESHOLD_PX = 50;

const arrowClasses =
  "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/70 text-fg backdrop-blur transition hover:bg-ember hover:text-canvas sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100";

const ProductGallery = ({ slug, images, alt, soldOut = false }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const gallery = images ?? [];
  const hasImages = gallery.length > 0;
  const hasMultiple = gallery.length > 1;
  const total = gallery.length;

  const showPrevious = () => setActiveIndex((index) => (index === 0 ? total - 1 : index - 1));
  const showNext = () => setActiveIndex((index) => (index === total - 1 ? 0 : index + 1));

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > SWIPE_THRESHOLD_PX) showPrevious();
    if (deltaX < -SWIPE_THRESHOLD_PX) showNext();
  };

  return (
    <div>
      <div
        className="group relative aspect-square overflow-hidden rounded-xs bg-surface"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {hasImages ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open image viewer"
            className="block h-full w-full cursor-zoom-in"
          >
            <img
              src={gallery[activeIndex]}
              alt={alt}
              decoding="async"
              className={`h-full w-full object-cover ${soldOut ? "opacity-70" : ""}`}
            />
          </button>
        ) : (
          <PlaceholderImage seed={slug} className="h-full w-full object-cover" />
        )}

        {hasImages && (
          <span className="pointer-events-none absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-canvas/70 text-fg backdrop-blur">
            <ExpandIcon className="h-4 w-4" />
          </span>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous image"
              className={`${arrowClasses} left-3`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className={`${arrowClasses} right-3`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-canvas/70 px-3 py-1 text-[0.65rem] tracking-[0.2em] text-muted backdrop-blur">
              {activeIndex + 1} / {total}
            </p>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`aspect-square overflow-hidden rounded-xs border transition ${
                index === activeIndex
                  ? "border-ember opacity-100"
                  : "border-line opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && hasImages && (
        <Lightbox
          images={gallery}
          index={activeIndex}
          alt={alt}
          onIndexChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductGallery;
