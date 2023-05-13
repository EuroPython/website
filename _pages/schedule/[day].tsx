import parse from "date-fns/parse";
import format from "date-fns/format";

import { Layout } from "../../components/layout";
import { useCallback } from "react";
import { fetchSchedule } from "../../lib/schedule";

import {
  getDayType,
  getScheduleForDay,
} from "../../components/schedule/schedule-utils";
import { Schedule } from "../../components/schedule/schedule";
import { Schedule as ScheduleType } from "../../components/schedule/types";
import { fetchSessions } from "../../lib/sessions";
import { fetchSpeakers } from "../../lib/speakers";
import { Title } from "components/typography/title";
import { Select } from "components/form/select";
import { Fullbleed } from "components/layout/fullbleed";

export default function SchedulePage({
  day,
  days,
  schedule,
}: {
  day: string;
  days: { day: string; type: string }[];
  schedule: ScheduleType;
}) {
  const handleDaySelected = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    window.location.href = `/schedule/${event.target.value}`;
  }, []);

  const sortedDays = days.sort((a, b) => {
    return (
      parse(a.day, "yyyy-MM-dd", new Date()).getTime() -
      parse(b.day, "yyyy-MM-dd", new Date()).getTime()
    );
  });

  const dayType = getDayType(day);

  return (
    <Layout>
      <article className="accent-left">
        <Title highlighted>Schedule</Title>

        <Select
          id="schedule-select"
          name="schedule-select"
          variant="rounded"
          onChange={handleDaySelected}
          defaultValue={day}
        >
          {sortedDays.map(({ day, type }) => {
            const date = parse(day, "yyyy-MM-dd", new Date());
            const isoDate = format(date, "yyyy-MM-dd");
            const dateText = format(date, "eeee, do MMMM, yyyy");

            return (
              <option key={isoDate} value={isoDate}>
                {dateText} - {type}
              </option>
            );
          })}
        </Select>
      </article>

      <Fullbleed>
        <Schedule schedule={schedule} dayType={dayType} />
      </Fullbleed>

      <h1 className="highlighted">
        <a href="#schedule-select" className="h1">
          Back to top
        </a>
      </h1>
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
  const [schedule, sessions, speakers] = await Promise.all([
    fetchSchedule(),
    fetchSessions(),
    fetchSpeakers(),
  ]);

  const daySchedule = await getScheduleForDay({
    schedule,
    day: params.day,
    sessions,
    speakers,
  });

  return {
    props: {
      day: params.day,
      schedule: daySchedule,
      days: Object.entries(schedule.days).map(([day, _]) => ({
        day,
        type: getDayType(day),
      })),
    },
    revalidate: 60,
  };
}
