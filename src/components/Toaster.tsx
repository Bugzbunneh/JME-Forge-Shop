import { useToastStore } from "../stores/useToastStore";
import { CheckIcon } from "./icons";

const Toaster = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-60 flex flex-col items-center gap-2 px-4 sm:bottom-8"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex animate-toast-in items-center gap-3 rounded-xs border border-line bg-raised px-5 py-3 text-sm text-fg shadow-2xl shadow-black/50"
        >
          <CheckIcon className="h-4 w-4 shrink-0 text-ember" />
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toaster;
