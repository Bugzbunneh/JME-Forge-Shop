import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    if (navigationType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollManager;
