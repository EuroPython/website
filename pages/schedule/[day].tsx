import parse from "date-fns/parse";
import format from "date-fns/format";

import { Layout } from "../../components/layout";
import type { Event } from "../../types/schedule";
import { useCallback } from "react";
import { fetchSchedule } from "../../lib/schedule";
import { Session } from "../../components/schedule/session";
import {
  numberToTime,
  timeToNumber,
} from "../../components/schedule/time-helpers";
import { Break } from "../../components/schedule/break";
import { getPositionForEvent, getScheduleForDay } from "./schedule-utils";
import { Schedule } from "./types";

const TimeSlot = ({
  time,
  events,
  schedule,
  totalRooms,
}: {
  time: string;
  events: Event[];
  schedule: Schedule;
  totalRooms: number;
}) => {
  const position = getPositionForEvent(events[0], schedule);

  // "break" events don't need to show the time as they
  // are basically a separator for the time slots
  if (events.length === 1 && events[0].type === "break") {
    return (
      <Break
        event={events[0]}
        style={{
          "--grid-row": `${position.rows.start} / ${position.rows.end}`,
          "--grid-column": `1 / ${totalRooms + 2}`,
        }}
      />
    );
  }

  return (
    <div className="row">
      <div
        className="talk__time"
        style={{
          "--grid-row": `${position.rows.start} / ${position.rows.end}`,
          "--grid-column": "1 / 2",
        }}
      >
        {numberToTime(timeToNumber(time))}
      </div>
      {events.map((event) => {
        const position = getPositionForEvent(event, schedule);

        if (event.type === "break") {
          console.warn("Only talks supported", event.type, event, events);

          return null;
        }

        return (
          <Session
            key={event.id}
            event={event}
            style={{
              "--grid-row": `${position.rows.start} / ${position.rows.end}`,
              "--grid-column": `${position.cols.start} / ${position.cols.end}`,
            }}
          />
        );
      })}
    </div>
  );
};

export default function SchedulePage({
  day,
  days,
  schedule,
}: {
  day: string;
  days: string[];
  schedule: Schedule;
}) {
  const handleDaySelected = useCallback((event) => {
    window.location.href = `/schedule/${event.target.value}`;
  }, []);

  const totalSlots = Object.keys(schedule.timeslots).length;
  const totalRooms = schedule.rooms.length;

  const gridTemplateRows =
    "3.5rem " +
    Object.entries(schedule.timeslots)
      .map(([_, events]) => {
        if (events.length === 1 && events[0].type === "break") {
          return "3.5rem";
        }

        return "2fr";
      })
      .join(" ");

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

        <div className="full-width schedule__container">
          <div
            className="schedule"
            style={{
              gridTemplateRows,
              "--total-slots": totalSlots.toString(),
              "--total-rooms": totalRooms.toString(),
            }}
          >
            <h2 className="h4 schedule__date">Monday, 11th July, 2022</h2>
            <div className="headings">
              <span
                style={{
                  "--grid-row": "1 / 2",
                  "--grid-column": "1 / 2",
                }}
              >
                Time
              </span>
              {schedule.rooms.map((track, index) => (
                <span
                  key={track}
                  style={{
                    "--grid-row": "1 / 2",
                    "--grid-column": `${index + 2}/${index + 3}`,
                  }}
                >
                  {track}
                </span>
              ))}
            </div>

            {Object.entries(schedule.timeslots).map(([time, events]) => (
              <TimeSlot
                time={time}
                events={events}
                schedule={schedule}
                key={time}
                totalRooms={totalRooms}
              />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const schedule = await fetchSchedule();

  const paths = Object.keys(schedule.days).map((day) => ({
    params: { day: day },
  }));

  return { paths, fallback: false };
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
  };
}
