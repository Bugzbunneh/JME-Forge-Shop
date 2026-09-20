import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description: string;
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

export const useSeo = ({ title, description }: SeoOptions) => {
  useEffect(() => {
    document.title = title;
    setMetaTag("description", description);
  }, [title, description]);
};
