const logoImports = import.meta.glob<true, string, { default: ImageMetadata }>(
  "../content/sponsors/*/*.{svg,png,webp}",
  { eager: true }
);

export const sponsorLogos: Record<string, ImageMetadata> = {};

for (const path in logoImports) {
  // Extract sponsor ID from path. Match files named either <sponsorId>.<ext> or logo.<ext>
  const match = path.match(/\/sponsors\/([^/]+)\/(?:\1|logo)\.(svg|png|webp)$/);
  if (match) {
    const sponsorId = match[1];
    sponsorLogos[sponsorId] = logoImports[path].default;
  }
}
