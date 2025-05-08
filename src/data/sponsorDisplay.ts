const logoImports = import.meta.glob<true, string, { default: ImageMetadata }>(
  "../content/sponsors/*/display.png",
  { eager: true }
);

export const sponsorDisplay: Record<string, ImageMetadata> = {};

for (const path in logoImports) {
  const match = path.match(/\/sponsors\/([^/]+)\/display\.png$/);
  if (match) {
    const sponsorId = match[1];
    sponsorDisplay[sponsorId] = logoImports[path].default;
  }
}
