/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly EP_SESSIONS_API: string;
  readonly EP_SPEAKERS_API: string;
  readonly EP_SCHEDULE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __GIT_VERSION__: string;
declare const __TIMESTAMP__: string;
