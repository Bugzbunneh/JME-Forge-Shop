import { useSavedStore } from "../stores/useSavedStore";
import { useToastStore } from "../stores/useToastStore";
import { HeartIcon } from "./icons";

interface SaveButtonProps {
  productId: string;
  productName: string;
  className?: string;
  withLabel?: boolean;
}

const SaveButton = ({ productId, productName, className = "", withLabel }: SaveButtonProps) => {
  const isSaved = useSavedStore((state) => state.ids.includes(productId));
  const toggleSaved = useSavedStore((state) => state.toggleSaved);
  const showToast = useToastStore((state) => state.showToast);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSaved(productId);
    showToast(isSaved ? `Removed ${productName} from saved` : `Saved ${productName}`);
  };

  const label = isSaved ? "Saved" : "Save";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${productName} from saved` : `Save ${productName}`}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${
        isSaved ? "text-ember" : "text-fg hover:text-ember"
      } ${className}`}
    >
      <HeartIcon className="h-5 w-5" filled={isSaved} />
      {withLabel && (
        <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase">{label}</span>
      )}
    </button>
  );
};

export default SaveButton;
