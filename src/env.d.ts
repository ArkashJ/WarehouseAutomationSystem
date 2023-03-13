/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_URL: string
    // more env variables...
    readonly VITE_SubKEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  