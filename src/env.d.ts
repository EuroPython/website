/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly EP_SESSIONS_API: string;
  readonly EP_SPEAKERS_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
