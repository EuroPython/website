import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import format from "date-fns/format";

import { fetchSchedule } from "./lib/schedule";

const getScheduleDays = async () => {
  const schedule = await fetchSchedule();

  const potentialUnsortedDays = Array.from(new Set(Object.keys(schedule.days)));

  return potentialUnsortedDays.sort((a, b) => {
    const aDate = new Date(a);
    const bDate = new Date(b);

    return aDate.getTime() - bDate.getTime();
  });
};

export async function middleware(request: NextRequest) {
  const days = await getScheduleDays();

  if (days.length > 0) {
    const today = format(new Date(), "yyyy-MM-dd");

    let day = days.includes(today) ? today : days[0];

    return NextResponse.redirect(new URL(`/schedule/${day}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/schedule",
};
