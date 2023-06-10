import { fetchSchedule } from "@/lib/pretix/schedule";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { days } = await fetchSchedule();

  const day = format(days[0], "yyyy-MM-dd");

  return redirect(`/schedule/${day}`);
}
