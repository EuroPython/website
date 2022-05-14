import parse from "date-fns/parse";
import format from "date-fns/format";

import { Layout } from "../../components/layout";
import scheduleData from "../../data/schedule.json";
import type { Event, TalkType } from "../../types/schedule";
import { useCallback } from "react";

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

type Slots = Record<string, Event[]>;

type Schedule = {
  rooms: string[];
  events: Event[];
  timeslots: Slots;
};

const getSchedule = (day: string): Schedule => {
  let currentDay = scheduleData.days[day as keyof typeof scheduleData["days"]];

  const events: Event[] = currentDay.talks.map((event, index) => {
    const time = timeToNumber(event.time);
    const evDuration = parseInt(event.ev_duration || "0", 10);
    const ttDuration = parseInt(event.tt_duration || "0", 10);

    const endTime = time + (evDuration || ttDuration);

    return {
      id: index.toString(),
      title: event.title || event.ev_custom,
      day: event.day,
      time: event.time,
      endTime: numberToTime(endTime),
      audience: event.level,
      rooms: event.rooms,
      type: event.ev_custom ? "break" : "talk",
      speakers: [
        {
          name: event.speaker,
          tagline: event.speaker,
          image: "https://avatars.dicebear.com/api/adventurer/Gpcjwb.svg",
        },
      ],
    };
  });

  const timeslots = events.reduce<Slots>((acc, talk) => {
    const key = talk.time;
    acc[key] = acc[key] || [];
    acc[key].push(talk);
    return acc;
  }, {});

  return {
    rooms: currentDay.rooms,
    events,
    timeslots,
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

const getPositionForEvent = (event: Event, schedule: Schedule): Position => {
  const startTime = timeToNumber(event.time);
  const endTime = timeToNumber(event.endTime);

  const timeSlotsNumbers = Object.keys(schedule.timeslots).map((time) =>
    timeToNumber(time)
  );

  // startTime will always be present in timeSlots, since they are created based on
  // startTimes
  const startTimeIndex = timeSlotsNumbers.indexOf(startTime);
  // endTime might not be there because talks will potentially end before the next startTime
  const timeSlotAfterEnd = timeSlotsNumbers.find((t) => t >= endTime);

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
          ? timeSlotsNumbers.indexOf(timeSlotAfterEnd)
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

export default function SchedulePage({
  day,
  schedule,
}: {
  day: string;
  schedule: Schedule;
}) {
  const handleDaySelected = useCallback((event) => {
    window.location.href = `/schedule/${event.target.value}`;
  }, []);

  const days = Object.keys(scheduleData.days).map((date) =>
    parse(date, "yyyy-MM-dd", new Date())
  );

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
            {days.map((d) => {
              const isoDate = format(d, "yyyy-MM-dd");
              const dateText = format(d, "eeee, do MMMM, yyyy");

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
  const paths = Object.keys(scheduleData.days).map((day) => ({
    params: { day: day },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { day: string } }) {
  const schedule = getSchedule(params.day);

  console.log(schedule);

  return { props: { day: params.day, schedule } };
}
