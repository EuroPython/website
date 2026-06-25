import type { APIRoute } from "astro";
import { generateBingoSvg, SVG_W } from "@data/bingoCardSvg";
import { Resvg } from "@resvg/resvg-js";

export const GET: APIRoute = async ({ url }) => {
  const cellsParam = url.searchParams.get("cells") || "";
  const isDark = url.searchParams.get("dark") !== "0";

  const checked = new Array(25).fill(false);
  if (cellsParam) {
    cellsParam
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n) && n >= 0 && n < 25)
      .forEach((i) => {
        checked[i] = true;
      });
  }

  const svg = generateBingoSvg({ checked, isDark });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: SVG_W * 2,
    },
    background: isDark ? "#0b1121" : "#f5f0eb",
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const body = new Uint8Array(pngBuffer);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
};
