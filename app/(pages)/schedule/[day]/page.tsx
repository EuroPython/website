import { Fullbleed } from "components/layout/fullbleed";
import { Schedule } from "components/schedule/schedule";
import { Title } from "components/typography/title";
import { notFound } from "next/navigation";
import { SelectDay } from "./select-day";
import { getSchedule, getScheduleDays } from "@/lib/pretalx/schedule";
import { formatInTimeZone } from "date-fns-tz";

export const fetchCache = "force-cache";

export async function generateStaticParams() {
  const days = await getScheduleDays();

  return days.map((day) => ({
    params: {
      day: formatInTimeZone(day, "Europe/Prague", "yyyy-MM-dd"),
    },
  }));
}

export default async function SchedulePage({
  params,
}: {
  params: { day: string };
}) {
  // const schedule = await getSchedule(params.day);
  const schedule = null;

  if (!schedule) {
    throw notFound();
  }

  return (
    <>
      <article className="accent-left">
        <Title highlighted>Schedule</Title>

        {/* @ts-ignore */}
        <SelectDay day={params.day} days={schedule.days} />
      </article>

      <Fullbleed>
        <Schedule schedule={schedule} dayType={"Talks"} />
      </Fullbleed>

      <Title>
        <a href="#schedule-select" className="h1">
          Back to top
        </a>
      </Title>

      <div className="h-12"></div>
    </>
  );
}
