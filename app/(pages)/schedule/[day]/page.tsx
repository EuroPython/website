import { fetchSchedule } from "@/lib/pretix/schedule";
import { Fullbleed } from "components/layout/fullbleed";
import { Schedule } from "components/schedule/schedule";
import { Title } from "components/typography/title";
import { notFound } from "next/navigation";
import { SelectDay } from "./select-day";

export const revalidate = 300;

export default async function SchedulePage({
  params,
}: {
  params: { day: string };
}) {
  const { schedule, days, dividedSchedule } = await fetchSchedule(params.day);

  if (!schedule) {
    throw notFound();
  }

  return (
    <>
      <article className="accent-left">
        <Title highlighted>Schedule</Title>

        <SelectDay day={params.day} days={days} />
      </article>

      <Fullbleed>
        <Schedule schedule={dividedSchedule} dayType={"Talks"} />
      </Fullbleed>

      <h1 className="highlighted">
        <a href="#schedule-select" className="h1">
          Back to top
        </a>
      </h1>

      <div className="h-12"></div>
    </>
  );
}
