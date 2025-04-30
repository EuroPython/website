const logoImports = import.meta.glob<true, string, { default: ImageMetadata }>(
  "../content/companies/*/{logo,*}.@(svg|png|webp)",
  { eager: true }
);

export const companyLogos: Record<string, ImageMetadata> = {};

for (const path in logoImports) {
  const match = path.match(
    /\/companies\/([^/]+)\/(?:\1|logo)\.(svg|png|webp)$/
  );
  if (match) {
    const companyId = match[1];
    companyLogos[companyId] = logoImports[path].default;
  }
}
