import type { ImageMetadata } from "astro";

const displayImports = import.meta.glob<{ default: ImageMetadata }>(
  "../content/sponsors/*/display.png"
);

const logoImports = import.meta.glob<{ default: ImageMetadata }>(
  "../content/sponsors/*/*.svg"
);

const pngImports = import.meta.glob<{ default: ImageMetadata }>(
  "../content/sponsors/*/*.png"
);

export async function getSponsorLogo(
  sponsorId: string
): Promise<ImageMetadata | undefined> {
  const svgPath = `../content/sponsors/${sponsorId}/${sponsorId}.svg`;
  const svgLoader = logoImports[svgPath];
  if (svgLoader) {
    return (await svgLoader()).default;
  }

  const pngPath = `../content/sponsors/${sponsorId}/${sponsorId}.png`;
  const pngLoader = pngImports[pngPath];
  if (pngLoader) {
    return (await pngLoader()).default;
  }

  const logoPngPath = `../content/sponsors/${sponsorId}/logo.png`;
  const logoPngLoader = pngImports[logoPngPath];
  if (logoPngLoader) {
    return (await logoPngLoader()).default;
  }

  return undefined;
}
