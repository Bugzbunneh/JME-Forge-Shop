import { useEffect, useState } from "react";
import { ArrowUpIcon } from "./icons";

const SHOW_AFTER_PX = 700;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed right-6 bottom-6 z-30 hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-raised/90 text-fg backdrop-blur transition-all duration-300 hover:border-ember hover:text-ember sm:flex ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
};

export default BackToTop;
