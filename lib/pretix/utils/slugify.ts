import slug from "slug";

export const slugify = (text: string) => {
  return slug(text);
};
