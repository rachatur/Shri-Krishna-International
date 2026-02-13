/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ERP_BASE_URL?: string;
  readonly VITE_ERP_API_PATH?: string;
  readonly VITE_ERP_TIMEOUT?: string;
  readonly VITE_ERP_API_KEY?: "d1cf382b13556fd";
  readonly VITE_ERP_API_SECRET?: "e1bf954702dddc4";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
