const logoImports = import.meta.glob<true, string, { default: ImageMetadata }>(
  "../content/sponsors/*/{logo,*}.@(svg|png|webp)",
  { eager: true }
);

export const sponsorLogos: Record<string, ImageMetadata> = {};

for (const path in logoImports) {
  const match = path.match(/\/sponsors\/([^/]+)\/(?:\1|logo)\.(svg|png|webp)$/);
  if (match) {
    const sponsorId = match[1];
    sponsorLogos[sponsorId] = logoImports[path].default;
  }
}
