import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description: string;
  noindex?: boolean;
}

const setMetaTag = (name: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export const useSeo = ({ title, description, noindex = false }: SeoOptions) => {
  useEffect(() => {
    document.title = title;
    setMetaTag("description", description);
  }, [title, description]);

  useEffect(() => {
    if (!noindex) return;

    setMetaTag("robots", "noindex");
    return () => {
      document.querySelector('meta[name="robots"]')?.remove();
    };
  }, [noindex]);
};
