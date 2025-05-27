import { persistentMap } from "@nanostores/persistent";

export const favorites = persistentMap(
  "codeheart_v2:",
  {},
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
