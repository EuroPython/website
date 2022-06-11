import type { Session } from "./types";

import { timeToNumber, numberToTime } from "./time-helpers";
import { Schedule, Slots } from "./types";

const TYPES_MAP = {
  "Talk [in-person]": "talk",
  "Talk [remote]": "talk-remote",
  "Poster [in-person]": "poster",
  "Tutorial [in-person]": "tutorial",
};

const AUDIENCE_MAP = {
  none: "beginner",
  some: "intermediate",
  expert: "advanced",
};

type Position = {
  rows: { start: number; end: number };
  cols: {
    start: number;
    end: number;
  };
};

const convertTalk = (talk: any): Session[] => {
  const time = timeToNumber(talk.time);
  const evDuration = parseInt(talk.ev_duration || "0", 10);
  const ttDuration = parseInt(talk.tt_duration || "0", 10);

  const duration = evDuration || ttDuration;
  const endTime = time + duration;
  // @ts-ignore we should improve the API
  let eventType = TYPES_MAP[talk.type] || "";
  const title = talk.title || talk.ev_custom;

  if (eventType === "") {
    const lowerTitle = title.toLocaleLowerCase();
    if (lowerTitle === "coffee break" || lowerTitle === "lunch break") {
      eventType = "break";
    } else {
      console.log(eventType);
    }
  }

  return {
    id: talk.talk_id || talk.event_id,
    title,
    duration,
    day: talk.day,
    time,
    endTime,
    // @ts-ignore we should improve the API
    audience: AUDIENCE_MAP[talk.level] || "",
    rooms: talk.rooms,
    slug: talk.slug || "",
    type: eventType,
    speakers: [
      {
        name: talk.speaker,
      },
    ],
  };
};

const getTimeSlots = (sessions: Session[]) => {
  type TimeSlot = {
    type: "timeslot";
    duration: number;
    time: string;
    sessions: Session[];
  };

  const sessionsByTime = Object.values(
    sessions
      .sort((a, b) => {
        return a.time - b.time;
      })
      .reduce<Record<number, TimeSlot>>((acc, talk) => {
        const key = talk.time;

        acc[key] = acc[key] || {
          time: key,
          sessions: [],
          duration: 0,
          type: "timeslot",
        };

        acc[key].sessions.push(talk);
        acc[key].duration = Math.max(
          ...acc[key].sessions.map((s) => s.duration)
        );

        return acc;
      }, {})
  );

  const timeslots = sessionsByTime.map((timeslot, index) => {
    if (timeslot.sessions.length === 1) {
      if (timeslot.sessions[0].type === "break") {
        return {
          ...timeslot,
          title: timeslot.sessions[0].title,
          type: "break",
        };
      }

      // special case for the first and last events in the day
      // they are usually a keynote or lighting talk
      // TODO: there might be more than one

      const isFirst = index === 0;
      const isLast = index === sessionsByTime.length - 1;
      const isFirstOrLast = isFirst || isLast;
      if (!isFirstOrLast) {
        return {
          ...timeslot,
          session: timeslot.sessions[0],
          type: "orphan",
        };
      }
    }

    return timeslot;
  });

  return timeslots;
};

export const getScheduleForDay = async ({
  schedule,
  day,
}: {
  schedule: any;
  day: string;
}) => {
  let currentDay = schedule.days[day];

  let sessions: Session[] = currentDay.talks.map(convertTalk);
  const parts = getTimeSlots(sessions);

  return { parts, rooms: currentDay.rooms };
};
