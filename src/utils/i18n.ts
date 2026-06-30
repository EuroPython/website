/**
 * i18n — translation map for display strings.
 *
 * API data may contain internal labels that should be shown differently
 * to visitors. Add entries here rather than patching individual components.
 */
const translations: Record<string, string> = {
  "~ None of these topics": "General",
};

/**
 * Translate a key to its display form. Returns the key unchanged if no
 * translation is registered.
 */
export function t(key: string | null | undefined): string {
  if (!key) return "";
  return translations[key] || key;
}
