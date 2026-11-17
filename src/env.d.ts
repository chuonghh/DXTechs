/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Đường dẫn gốc của API, ví dụ "/api" (cùng domain) hoặc "https://api.example.com/api". */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
