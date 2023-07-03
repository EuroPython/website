import { getScheduleDays } from "@/lib/pretalx/schedule";
import { formatInTimeZone } from "date-fns-tz";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const days = await getScheduleDays();

  const day = formatInTimeZone(days[0], "Europe/Prague", "yyyy-MM-dd");

  return redirect(`/schedule/${day}`);
}
