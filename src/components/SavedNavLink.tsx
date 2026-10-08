import { Link } from "react-router-dom";
import { useSavedStore } from "../stores/useSavedStore";
import { HeartIcon } from "./icons";

const SavedNavLink = () => {
  const savedCount = useSavedStore((state) => state.ids.length);
  const label = savedCount > 0 ? `Saved pieces (${savedCount})` : "Saved pieces";

  return (
    <Link
      to="/saved"
      aria-label={label}
      className="relative text-muted transition-colors hover:text-fg"
    >
      <HeartIcon className="h-6 w-6" filled={savedCount > 0} />
      {savedCount > 0 && (
        <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[0.6rem] leading-none font-bold text-canvas">
          {savedCount}
        </span>
      )}
    </Link>
  );
};

export default SavedNavLink;
