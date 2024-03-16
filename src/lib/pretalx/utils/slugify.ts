import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import slug from "slug";

export const slugify = (text: string) => {
  if (text.toLocaleLowerCase() === "morning announcement") {
  }

  return slug(text);
};

export const slugifySession = ({
  title,
  start,
}: {
  title: string;
  start: Date | null;
}) => {
  if (title.toLocaleLowerCase() === "morning announcement" && start) {
    const day = formatInTimeZone(start, "Europe/Prague", "yyyy-MM-dd");

    return `${day}-morning-announcement`;
  }

  return slug(title);
};
