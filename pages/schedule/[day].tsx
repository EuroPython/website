import parse from "date-fns/parse";
import format from "date-fns/format";

import { Layout } from "../../components/layout";
import { useCallback } from "react";
import { fetchSchedule } from "../../lib/schedule";

import { getScheduleForDay } from "../../components/schedule/schedule-utils";
import { Schedule } from "../../components/schedule/schedule";
import { Schedule as ScheduleType } from "../../components/schedule/types";

export default function SchedulePage({
  day,
  days,
  schedule,
}: {
  day: string;
  days: string[];
  schedule: ScheduleType;
}) {
  const handleDaySelected = useCallback((event) => {
    window.location.href = `/schedule/${event.target.value}`;
  }, []);

  return (
    <Layout>
      <main id="main-content">
        <article className="accent-left">
          <h1 className="highlighted">Schedule</h1>

          <select
            id="schedule-select"
            className="select--schedule"
            onChange={handleDaySelected}
            defaultValue={day}
          >
            {days
              .map((day) => parse(day, "yyyy-MM-dd", new Date()))
              .sort((a, b) => a.getTime() - b.getTime())
              .map((date) => {
                const isoDate = format(date, "yyyy-MM-dd");
                const dateText = format(date, "eeee, do MMMM, yyyy");

                return (
                  <option key={isoDate} value={isoDate}>
                    {dateText}
                  </option>
                );
              })}
          </select>
        </article>

        <Schedule schedule={schedule} />
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const schedule = await fetchSchedule();

  const paths = Object.keys(schedule.days).map((day) => ({
    params: { day: day },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { day: string } }) {
  const schedule = await fetchSchedule();
  const daySchedule = await getScheduleForDay({ schedule, day: params.day });

  return {
    props: {
      day: params.day,
      schedule: daySchedule,
      days: Object.keys(schedule.days),
    },
    revalidate: 60,
  };
}
