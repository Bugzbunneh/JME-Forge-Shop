/// <reference types="vite/client" />

interface Window {
  __REACT_QUERY_STATE__?: import("@tanstack/react-query").DehydratedState;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
