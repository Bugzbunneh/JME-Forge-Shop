import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./icons";

interface LightboxProps {
  images: string[];
  index: number;
  alt: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const Lightbox = ({ images, index, alt, onIndexChange, onClose }: LightboxProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;
  const hasMultiple = total > 1;

  useBodyScrollLock(true);

  const showPrevious = () => onIndexChange(index === 0 ? total - 1 : index - 1);
  const showNext = () => onIndexChange(index === total - 1 ? 0 : index + 1);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasMultiple) {
        onIndexChange(index === 0 ? total - 1 : index - 1);
      }
      if (event.key === "ArrowRight" && hasMultiple) {
        onIndexChange(index === total - 1 ? 0 : index + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, total, hasMultiple, onClose, onIndexChange]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > 50) showPrevious();
    if (deltaX < -50) showNext();
  };

  const controlClasses =
    "absolute z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-fg backdrop-blur transition-colors hover:bg-ember hover:text-canvas";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — image viewer`}
      className="fixed inset-0 z-80 flex animate-fade-in items-center justify-center bg-black/95"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className={`${controlClasses} top-4 right-4`}
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
            className={`${controlClasses} top-1/2 left-4 -translate-y-1/2`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
            className={`${controlClasses} top-1/2 right-4 -translate-y-1/2`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt={`${alt} — view ${index + 1}`}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] object-contain select-none"
      />

      {hasMultiple && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.25em] text-muted">
          {index + 1} / {total}
        </p>
      )}
    </div>,
    document.body,
  );
};

export default Lightbox;
