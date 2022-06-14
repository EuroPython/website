import { timeToNumber } from "./time-helpers";
import {
  OrphanTimeSlot,
  Schedule,
  Session,
  SessionsTimeSlot,
  TimeSlot,
} from "./types";

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

const mode = (arr: number[]) =>
  arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();

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
    const type = (talk.type as string).toLocaleLowerCase();

    if (type.startsWith("keynote")) {
      eventType = "keynote";
    } else if (type.startsWith("lightning talk")) {
      eventType = "lightning-talks";
    } else if (type.startsWith("panel")) {
      eventType = "panel";
    } else if (type.startsWith("opening session")) {
      eventType = "opening-session";
    } else if (type.startsWith("sponsored talk")) {
      eventType = "sponsored-talk";
    } else {
      const lowerTitle = title.toLocaleLowerCase();

      if (lowerTitle === "coffee break" || lowerTitle === "lunch break") {
        eventType = "break";
      } else {
        console.info(eventType);
      }
    }
  }

  const speakers = talk.speakers
    ? talk.speakers.map((speaker: string) => ({
        name: speaker,
      }))
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
      .reduce<Record<number, { time: number; sessions: Session[] }>>(
        (acc, talk) => {
          const key = talk.time;

          acc[key] = acc[key] || {
            time: key,
            sessions: [],
          };

          acc[key].sessions.push(talk);

          return acc;
        },
        {}
      )
  );

  let breakSeen = false;
  const orphans: OrphanTimeSlot[] = [];

  const timeslots = sessionsByTime
    .map((timeslot, index) => {
      if (timeslot.sessions.length === 1) {
        if (timeslot.sessions[0].type === "break") {
          breakSeen = true;

          return {
            time: timeslot.time,
            title: timeslot.sessions[0].title,
            duration: timeslot.sessions[0].duration,
            type: "break",
          };
        }
        // special case for the first and last events in the day
        // they are usually a keynote or lighting talk
        // we also treat all orphans before breaks as timeslots
        // this is pretty hacky but it works for now

        const hasBreaksAfter = sessionsByTime
          .slice(index + 1)
          .some((timeslot) =>
            timeslot.sessions.some((session) => session.type === "break")
          );

        const isFirst = index === 0;
        const isLast = index === sessionsByTime.length - 1;
        const isFirstOrLast = isFirst || isLast;

        if (breakSeen && !isFirstOrLast && hasBreaksAfter) {
          orphans.push({
            time: timeslot.time,
            session: timeslot.sessions[0],
            duration: timeslot.sessions[0].duration,
            type: "orphan",
          });

          return null;
        }
      }

      return {
        time: timeslot.time,
        duration: -1,
        sessions: timeslot.sessions,
        type: "timeslot",
      };
    })
    .filter((session) => session !== null) as TimeSlot[];

  for (let i = 0; i < timeslots.length; i++) {
    const timeslot = timeslots[i];
    let duration = timeslot.duration;
    const nextTimeslot = timeslots[i + 1];

    // TODO: correct this

    if (timeslot.type === "timeslot") {
      duration = mode(
        timeslot.sessions.map((session) => session.duration)
      ) as number;
    }

    timeslot.duration = duration;
  }

  return timeslots.concat(orphans);
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
