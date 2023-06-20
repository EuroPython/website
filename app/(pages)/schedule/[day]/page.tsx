import { Fullbleed } from "components/layout/fullbleed";
import { Schedule } from "components/schedule/schedule";
import { Title } from "components/typography/title";
import { notFound } from "next/navigation";
import { SelectDay } from "./select-day";
import { getSchedule, getScheduleDays } from "@/lib/pretalx/schedule";
import { format } from "date-fns";

export const revalidate = 300;

export async function generateStaticParams() {
  const days = await getScheduleDays();

  return days.map((day) => ({
    params: {
      day: format(day, "yyyy-MM-dd"),
    },
  }));
}

export default async function SchedulePage({
  params,
}: {
  params: { day: string };
}) {
  const schedule = await getSchedule(params.day);

  if (!schedule) {
    throw notFound();
  }

  return (
    <>
      <article className="accent-left">
        <Title highlighted>Schedule</Title>

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
