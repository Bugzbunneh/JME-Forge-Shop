import "@fontsource-variable/inter";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();
const dehydratedState = window.__REACT_QUERY_STATE__;

const container = document.getElementById("root")!;

const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HydrationBoundary>
    </QueryClientProvider>
  </StrictMode>
);

// Routes that are not prerendered are served an empty shell, which can't be hydrated.
const hasPrerenderedHtml = container.hasChildNodes();

if (hasPrerenderedHtml) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
