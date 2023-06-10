import { fetchSchedule } from "@/lib/pretix/schedule";
import { Select } from "components/form/select";
import { Fullbleed } from "components/layout/fullbleed";
import { Schedule } from "components/schedule/schedule";
import { Title } from "components/typography/title";
import { format, parse } from "date-fns";
import { notFound } from "next/navigation";
import { useCallback } from "react";

export default async function SchedulePage({
  params,
}: {
  params: { day: string };
}) {
  const { schedule, days } = await fetchSchedule(params.day);

  if (!schedule) {
    throw notFound();
  }

  // TODO: use router?
  //   const handleDaySelected = useCallback(
  //     (event: React.ChangeEvent<HTMLSelectElement>) => {
  //       window.location.href = `/schedule/${event.target.value}`;
  //     },
  //     []
  //   );

  return (
    <>
      <article className="accent-left">
        <Title highlighted>Schedule</Title>

        <Select
          id="schedule-select"
          name="schedule-select"
          variant="rounded"
          //   onChange={handleDaySelected}
          defaultValue={params.day}
        >
          {days.map((date) => {
            const isoDate = format(date, "yyyy-MM-dd");
            const dateText = format(date, "eeee, do MMMM, yyyy");

            return (
              <option key={isoDate} value={isoDate}>
                {dateText}
                {/* - {type} */}
              </option>
            );
          })}
        </Select>
      </article>

      <Fullbleed>
        <Schedule schedule={schedule} dayType={"Talks"} />
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
