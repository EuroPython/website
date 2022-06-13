import { timeToNumber } from "./time-helpers";
import { Schedule, Session, SessionsTimeSlot, TimeSlot } from "./types";

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

const convertTalk = (talk: any): Session => {
  const time = timeToNumber(talk.time);
  const evDuration = parseInt(talk.ev_duration || "0", 10);
  const ttDuration = parseInt(talk.tt_duration || "0", 10);

  const duration = evDuration || ttDuration;
  const endTime = time + duration;

  const id = (talk.talk_id || talk.event_id) as string;
  const title = (talk.title || talk.ev_custom) as string;
  const audience = AUDIENCE_MAP[talk.level as keyof typeof AUDIENCE_MAP] || "";
  const rooms = (talk.rooms || []) as string[];
  const slug = (talk.slug || "") as string;

  let eventType: string = TYPES_MAP[talk.type as keyof typeof TYPES_MAP] || "";

  if (eventType === "") {
    const lowerTitle = title.toLocaleLowerCase();
    if (lowerTitle === "coffee break" || lowerTitle === "lunch break") {
      eventType = "break";
    } else {
      console.log(eventType);
    }
  }

  const speakers = talk.speaker
    ? [
        {
          name: talk.speaker as string,
        },
      ]
    : [];

  return {
    id,
    title,
    duration,
    day: talk.day as string,
    time,
    endTime,
    audience,
    rooms,
    slug,
    type: eventType,
    speakers,
  };
};

const getTimeSlots = (sessions: Session[]) => {
  const sessionsByTime = Object.values(
    sessions
      .sort((a, b) => {
        return a.time - b.time;
      })
      .reduce<Record<number, SessionsTimeSlot>>((acc, talk) => {
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

  let breakSeen = false;

  const timeslots: TimeSlot[] = sessionsByTime.map((timeslot, index) => {
    if (timeslot.sessions.length === 1) {
      if (timeslot.sessions[0].type === "break") {
        breakSeen = true;
        return {
          ...timeslot,
          title: timeslot.sessions[0].title,
          type: "break",
        };
      }

      // special case for the first and last events in the day
      // they are usually a keynote or lighting talk
      // we also treat all orphans before breaks as timeslots
      // this is pretty hacky but it works for now

      const isFirst = index === 0;
      const isLast = index === sessionsByTime.length - 1;
      const isFirstOrLast = isFirst || isLast;

      if (breakSeen && !isFirstOrLast) {
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
  const slots = getTimeSlots(sessions);

  return { slots, rooms: currentDay.rooms } as Schedule;
};
