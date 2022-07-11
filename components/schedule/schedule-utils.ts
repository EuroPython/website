import { timeToNumber } from "./time-helpers";
import { OrphanTimeSlot, Session, TimeSlot } from "./types";

const TYPES_MAP = {
  "Talk [in-person]": "talk",
  Talk: "talk",
  "Talk [remote]": "talk-remote",
  "Poster [in-person]": "poster",
  Poster: "poster",
  "Tutorial [in-person]": "tutorial",
};

const AUDIENCE_MAP = {
  none: "beginner",
  some: "intermediate",
  expert: "advanced",
};

const convertTalk = (
  talk: any,
  sessions: any,
  speakersByName: Record<string, { name: string; slug: string }>
): Session => {
  const time = timeToNumber(talk.time);
  const evDuration = parseInt(talk.ev_duration || "0", 10);
  const ttDuration = parseInt(talk.tt_duration || "0", 10);

  const duration = evDuration || ttDuration;
  const endTime = time + duration;

  const id = (talk.talk_id || talk.event_id) as string;
  const title = (talk.title || talk.ev_custom) as string;
  let audience = AUDIENCE_MAP[talk.level as keyof typeof AUDIENCE_MAP] || "";
  const rooms = (talk.rooms || []) as string[];
  const slug = (talk.slug || "") as string;

  if (slug === "registration") {
    audience = "";
  }

  let eventType: string = TYPES_MAP[talk.type as keyof typeof TYPES_MAP] || "";

  if (eventType === "") {
    const type = (talk.type as string).toLocaleLowerCase();

    if (type.startsWith("keynote")) {
      eventType = "keynote";
    } else if (type.startsWith("lightning talk")) {
      eventType = "lightning-talks";
    } else if (type.startsWith("registration")) {
      eventType = "registration";
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
    ? talk.speakers.map(
        (speaker: string) =>
          speakersByName[speaker] || {
            name: speaker,
          }
      )
    : [];

  const sessionInfo = sessions.find((session: any) => session.code === id);

  return {
    id,
    title,
    duration,
    abstract: sessionInfo?.abstract || "",
    day: talk.day as string,
    time,
    endTime,
    audience,
    rooms,
    slug,
    type: eventType,
    speakers,
    start: sessionInfo?.start,
    end: sessionInfo?.end,
  };
};

const updateTimeslotDurations = (timeslots: TimeSlot[], rooms: string[]) => {
  const sessionsMatrix: number[][] = [];

  timeslots.forEach((timeslot) => {
    if (timeslot.type === "break") {
      sessionsMatrix.push(rooms.map(() => timeslot.duration));
    } else if (timeslot.type === "timeslot") {
      const row: number[] = [];

      // assuming all events are for just one room
      timeslot.sessions.forEach((session) => {
        const index = rooms.indexOf(session.rooms[0]);
        row[index] = session.duration;
      });

      sessionsMatrix.push(row);
    }
  });

  sessionsMatrix.forEach((row, index) => {
    const nextRow = sessionsMatrix[index + 1];
    let maxDuration = 0;

    row.forEach((duration, index) => {
      if (!nextRow || !nextRow[index]) {
        return;
      }

      maxDuration = Math.max(maxDuration, duration);
    });

    // this happens when there's no next row
    if (maxDuration == 0) {
      maxDuration = Math.max(...row.filter((x) => x !== null));
    }

    timeslots[index].duration = maxDuration;
  });
};

const getTimeslots = (sessions: Session[], rooms: string[]) => {
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

  updateTimeslotDurations(timeslots, rooms);

  return timeslots.concat(orphans);
};

export const getScheduleForDay = async ({
  schedule,
  day,
  sessions,
  speakers,
}: {
  schedule: any;
  sessions: any;
  day: string;
  speakers: any[];
}) => {
  const speakersByName = speakers.reduce<
    Record<string, { name: string; slug: string }>
  >((acc, speaker) => {
    acc[speaker.name] = speaker;
    return acc;
  }, {});

  const currentDay = schedule.days[day];
  const rooms = currentDay.rooms;
  const talks = currentDay.talks.map((talk: any) =>
    convertTalk(talk, sessions, speakersByName)
  );
  const slots = getTimeslots(talks, rooms);

  return { slots, rooms };
};

export const getDayType = (day: string) =>
  ["2022-07-11", "2022-07-12"].includes(day) ? "Tutorials" : "Talks";
