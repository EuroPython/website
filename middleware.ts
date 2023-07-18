import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getScheduleDays } from "./lib/pretalx/schedule";
import { formatInTimeZone } from "date-fns-tz";

export async function middleware(request: NextRequest) {
  try {
    const days = await getScheduleDays();

    if (days.length > 0) {
      const today = formatInTimeZone(new Date(), "Europe/Prague", "yyyy-MM-dd");
      const formattedDays = days.map((day) =>
        formatInTimeZone(day, "Europe/Prague", "yyyy-MM-dd")
      );

      let day = formattedDays.includes(today) ? today : days[0];

      return NextResponse.redirect(new URL(`/schedule/${day}`, request.url));
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/schedule",
};
