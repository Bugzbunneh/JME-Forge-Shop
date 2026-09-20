import { dehydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.tsx";
import { fetchProductBySlug, fetchProducts } from "./api/products.ts";

const PRODUCT_PATH_PATTERN = /^\/products\/([^/]+)$/;

export interface RenderResult {
  html: string;
  dehydratedState: DehydratedState;
}

export const renderPage = async (url: string): Promise<RenderResult> => {
  const queryClient = new QueryClient();

  if (url === "/products") {
    await queryClient.prefetchQuery({ queryKey: ["products"], queryFn: fetchProducts });
  }

  const productMatch = url.match(PRODUCT_PATH_PATTERN);
  if (productMatch) {
    const slug = productMatch[1];
    await queryClient.prefetchQuery({
      queryKey: ["product", slug],
      queryFn: () => fetchProductBySlug(slug),
    });
  }

  const html = renderToString(
    <StaticRouter location={url}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StaticRouter>,
  );

  const dehydratedState = dehydrate(queryClient);

  return { html, dehydratedState };
};
