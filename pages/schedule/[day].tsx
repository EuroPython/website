import parse from "date-fns/parse";
import format from "date-fns/format";

import { Layout } from "../../components/layout";
import scheduleData from "../../data/schedule.json";
import type { Event, TalkType } from "../../types/schedule";
import { useCallback } from "react";

const rooms = scheduleData.rooms;
const days = scheduleData.days.map((date) =>
  parse(date, "yyyy-MM-dd", new Date())
);

const numberToTime = (number: number) => {
  const hours = Math.floor(number / 60);
  const minutes = number % 60;

  const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hoursString}:${minutesString}`;
};

const timeToNumber = (time: string) => {
  const [hour, minute] = time.split(":");
  const hourInt = parseInt(hour, 10);
  const minuteInt = parseInt(minute, 10);
  return hourInt * 60 + minuteInt;
};

type Schedule = {
  rooms: string[];
  events: Event[];
};

const getSchedule = (day: string): Schedule => {
  const talks = scheduleData.talks.filter((t) => t.day === day);

  return {
    rooms,

    events: talks.map((talk, index) => {
      const time = timeToNumber(talk.time);
      const evDuration = parseInt(talk.ev_duration || "0", 10);
      const ttDuration = parseInt(talk.tt_duration || "0", 10);

      const endTime = time + (evDuration || ttDuration);

      return {
        id: index.toString(),
        title: talk.title || talk.ev_custom,
        day: talk.day,
        time: talk.time,
        endTime: numberToTime(endTime),
        audience: talk.level,
        rooms: talk.rooms,
        type: talk.ev_custom ? "break" : "talk",
        speakers: [
          {
            name: talk.speaker,
            tagline: talk.speaker,
            image: "https://avatars.dicebear.com/api/adventurer/Gpcjwb.svg",
          },
        ],
      };
    }),
  };
};

const Talk = ({
  event,
  style,
}: {
  event: Event & { type: TalkType | "lighting-talks" };
  style: React.CSSProperties;
}) => {
  const speakers = event.type === "lighting-talks" ? [] : event.speakers;

  const singleSpeaker = speakers?.length === 1;
  const firstSpeaker = speakers?.[0];

  return (
    <div className="talk" style={style}>
      {event.type !== "lighting-talks" && (
        <p className={`talk__rating ${event.audience}`}>
          <span>{event.audience}</span>
        </p>
      )}
      <p className="talk__title">
        <a href="/talks/example">{event.title}</a>
      </p>

      {speakers ? (
        <div className="talk__speaker">
          {singleSpeaker && firstSpeaker?.image ? (
            <img src={firstSpeaker.image} className="speaker__image" />
          ) : null}

          <div className="speaker__bio">
            <span className="speaker__name">
              {speakers?.map((s) => s.name).join(", ")}
            </span>
          </div>
        </div>
      ) : null}
      <div className="talk__mobile-details">
        {event.rooms.join(", ")}, {speakers?.map((s) => s.name).join(", ")}
      </div>
    </div>
  );
};

const Break = ({
  event,
  style,
}: {
  event: Event & { type: "break" };
  style: React.CSSProperties;
}) => {
  return (
    <div className="break" style={style}>
      <span>{numberToTime(timeToNumber(event.time))}</span>
      <span className="break__description">{event.title}</span>
    </div>
  );
};

type Position = {
  rows: { start: number; end: number };
  cols: {
    start: number;
    end: number;
  };
};

type Timeslots = number[];

const getPositionForEvent = (
  event: Event,
  timeSlots: Timeslots,
  schedule: Schedule
): Position => {
  const startTime = timeToNumber(event.time);
  const endTime = timeToNumber(event.endTime);

  // startTime will always be present in timeSlots, since they are created based on
  // startTimes
  const startTimeIndex = timeSlots.indexOf(startTime);
  // endTime might not be there because talks will potentially end before the next startTime
  const timeSlotAfterEnd = timeSlots.find((t) => t >= endTime);

  // assuming rooms have the same order as the rooms array
  const track = event.rooms[0];
  const trackIndex = schedule.rooms.indexOf(track);

  // we have the heading and css grid indexes start at 1
  const rowsOffset = 2;

  // we have the time and css grid indexes start at 1
  const colsOffset = 2;

  return {
    rows: {
      start: startTimeIndex + rowsOffset,
      end:
        (timeSlotAfterEnd
          ? timeSlots.indexOf(timeSlotAfterEnd)
          : startTimeIndex + 1) + rowsOffset,
    },
    cols: {
      start: trackIndex + colsOffset,
      end: trackIndex + colsOffset + event.rooms.length,
    },
  };
};

const TimeSlot = ({
  time,
  events,
  timeslots,
  schedule,
  totalRooms,
}: {
  time: string;
  events: Event[];
  timeslots: Timeslots;
  schedule: Schedule;
  totalRooms: number;
}) => {
  const position = getPositionForEvent(events[0], timeslots, schedule);

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
        const position = getPositionForEvent(event, timeslots, schedule);

        if (
          !["talk", "keynote", "workshop", "lighting-talks"].includes(
            event.type
          ) ||
          event.type === "break"
        ) {
          console.warn("Only talks supported", event.type);

          return null;
        }

        return (
          <Talk
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

export default function SchedulePage({ day }: { day: string }) {
  const schedule = getSchedule(day);

  const talks = schedule.events;

  type Slots = Record<string, Event[]>;
  const groups = talks.reduce<Slots>((acc, talk) => {
    const key = talk.time;
    acc[key] = acc[key] || [];
    acc[key].push(talk);
    return acc;
  }, {});

  const totalSlots = Object.keys(groups).length;
  const totalRooms = schedule.rooms.length;

  const gridTemplateRows =
    "3.5rem " +
    Object.entries(groups)
      .map(([time, events]) => {
        if (events.length === 1 && events[0].type === "break") {
          return "3.5rem";
        }

        return "2fr";
      })
      .join(" ");

  const timeslots = Object.keys(groups).map(timeToNumber);

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
          >
            {days.map((d) => {
              const isoDate = format(d, "yyyy-MM-dd");
              const dateText = format(d, "eeee, do MMMM, yyyy");

              return (
                <option
                  key={isoDate}
                  value={isoDate}
                  selected={isoDate === day}
                >
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

            {Object.entries(groups).map(([time, events]) => (
              <TimeSlot
                time={time}
                timeslots={timeslots}
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
  const paths = scheduleData.days.map((day) => ({
    params: { day: day },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { day: string } }) {
  // TODO: we should get the schedule here
  return { props: { day: params.day } };
}
