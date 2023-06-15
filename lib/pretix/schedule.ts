import { format, parse, parseISO } from "date-fns";
import { fetchConfirmedSubmissions } from "./submissions";
import { fetchSpeakersWithConfirmedSubmissions } from "./speakers";
import { numberToTime, timeToNumber } from "components/schedule/time-helpers";
import { getScheduleBreaks } from "./schedule-breaks";

export type ScheduleResponse = {
  schedule: APISchedule;
};

export type APISchedule = {
  version: string;
  base_url: string;
  conference: Conference;
};

export type Conference = {
  acronym: string;
  title: string;
  start: string;
  end: string;
  daysCount: number;
  timeslot_duration: string;
  time_zone_name: string;
  rooms: ConferenceRoom[];
  days: Day[];
};

export type ConferenceRoom = {
  name: string;
  guid: any;
  description?: string;
  capacity?: number;
};

export type Day = {
  index: number;
  date: string;
  day_start: string;
  day_end: string;
  rooms: Rooms;
};

export type Rooms = {
  [key: string]: RoomSession[];
};

export type RoomSession = {
  id: number;
  guid: string;
  logo: string;
  date: string;
  start: string;
  duration: string;
  room: string;
  slug: string;
  url: string;
  title: string;
  subtitle: string;
  track: string;
  type: string;
  language: string;
  abstract: string;
  description: string;
  recording_license: string;
  do_not_record: boolean;
  persons: Person[];
  links: any[];
  attachments: any[];
  answers: any[];
  experience?: string;
};

export type Person = {
  id: number;
  code: string;
  public_name: string;
  biography?: string;
  slug?: string;
  answers: any[];
};
export type TheAuditorium = {
  id: number;
  guid: string;
  logo: string;
  date: string;
  start: string;
  duration: string;
  room: string;
  slug: string;
  url: string;
  title: string;
  subtitle: string;
  track?: string;
  type: string;
  language: string;
  abstract: string;
  description: string;
  recording_license: string;
  do_not_record: boolean;
  persons: Person[];
  links: any[];
  attachments: any[];
  answers: any[];
};

export const transformSession = (
  session: RoomSession,
  codeToSubmission: {
    [key: string]: {
      experience?: string;
    };
  },
  codeToSpeaker: {
    [key: string]: {
      slug: string;
    };
  }
) => {
  const start = timeToNumber(session.start);
  const duration = timeToNumber(session.duration);

  const end = start + duration;
  let experience: string | undefined = undefined;

  // parse https://program.europython.eu/europython-2023/talk/CRTSNK/
  // if it exists
  if (session.url) {
    const urlPieces = session.url.split("/");
    const code = urlPieces[urlPieces.length - 2];

    const submission = codeToSubmission[code];

    if (!submission) {
      // TODO: keynotes?
      console.log(`Couldn't find ${session.url}`);
    } else {
      experience = submission.experience;
    }
  }

  const persons = session.persons.map((person) => {
    const speaker = codeToSpeaker[person.code];

    if (speaker) {
      person.slug = speaker.slug;
    }

    return person;
  });

  return {
    ...session,
    start,
    end,
    experience,
    duration,
    persons,
  };
};

export type Session = ReturnType<typeof transformSession>;

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const transformSchedule = async (schedule: Day) => {
  const allSubmissions = await fetchConfirmedSubmissions();
  const allSpeakers = await fetchSpeakersWithConfirmedSubmissions();
  const codeToSubmission = Object.fromEntries(
    allSubmissions.map((submission) => [submission.code, submission])
  );
  const codeToSpeaker = Object.fromEntries(
    allSpeakers.map((speaker) => [speaker.code, speaker])
  );
  const breaks = await getScheduleBreaks();

  const dayBreaks = breaks.filter((breakItem) => {
    return datesAreOnSameDay(breakItem.start, parseISO(schedule.date));
  });

  const rooms = Object.fromEntries(
    Object.entries(schedule.rooms).map(([room, sessions]) => {
      return [
        room,
        sessions
          .filter(
            ({ title }) =>
              title.toLocaleLowerCase().includes("placeholder") === false
          )
          .map((session) =>
            transformSession(session, codeToSubmission, codeToSpeaker)
          )
          .concat(
            dayBreaks.map((breakItem, index) => {
              const start = timeToNumber(format(breakItem.start, "HH:mm"));
              const end = timeToNumber(format(breakItem.end, "HH:mm"));
              const duration = end - start;

              console.log(breakItem.start);
              console.log(breakItem.end);
              console.log(duration);

              return {
                ...breakItem,
                start,
                end,
                duration,
                room: "break",
                id: index,
                guid: `${index}`,
                logo: "",
                date: breakItem.start.toISOString(),
                slug: "",
                url: "",
                title: "Break " + duration,
                subtitle: "",
                track: "",
                type: "break",
                language: "",
                abstract: "",
                description: "",
                recording_license: "",
                do_not_record: true,
                persons: [],
                links: [],
                attachments: [],
                answers: [],
                experience: undefined,
              };
            })
          ),
      ];
    })
  );

  const endsAt = Math.max(
    ...Object.values(rooms).flatMap((sessions) =>
      sessions.map((session) => session.end)
    )
  );

  const slots = Object.entries(schedule.rooms)
    .map(([room, slots]) => {
      return slots.map((slot) => {
        return {
          ...slot,
          room,
        };
      });
    })

    .flat();

  const times = Array.from(
    new Set([
      ...slots.map((slot) => timeToNumber(slot.start)),
      ...dayBreaks.map((breakItem) =>
        timeToNumber(format(breakItem.start, "HH:mm"))
      ),
    ])
  ).sort((a, b) => a - b);

  console.log(dayBreaks.map((breakItem) => format(breakItem.start, "HH:mm")));
  console.log(times);

  const gridTimes: {
    [time: string]: {
      startRow: number;
      endRow: number;
    };
  } = {};

  let currentStart = 0;
  let totalRows = 0;

  const MINUTES_PER_ROW = 5;

  times.forEach((currentTime, index) => {
    const time = numberToTime(currentTime);

    const nextElement = times[index + 1];

    if (nextElement !== undefined) {
      const diff = nextElement - currentTime;

      gridTimes[time] = {
        startRow: currentStart,
        endRow: currentStart + diff / MINUTES_PER_ROW,
      };

      currentStart = gridTimes[time].endRow;
      totalRows = gridTimes[time].endRow;
    }
  });

  const totalRooms = Object.keys(schedule.rooms).length;

  return {
    ...schedule,
    slots,
    // TODO: add break slots to rooms
    rooms,
    totalRooms,
    endsAt,
    grid: {
      times: gridTimes,
      rows: totalRows,
    },
  };
};

export const fetchSchedule = async (day?: string) => {
  // TODO: year from env/config?
  const response = await fetch(
    "https://program.europython.eu/europython-2023/schedule/export/schedule.json"
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = (await response.json()) as ScheduleResponse;

  const { conference } = data.schedule;

  const sortedDays = conference.days
    .map((day) => day)
    .sort((a, b) => {
      return (
        parse(a.date, "yyyy-MM-dd", new Date()).getTime() -
        parse(b.date, "yyyy-MM-dd", new Date()).getTime()
      );
    });

  const daySchedule = conference.days.find(
    (conferenceDay) => conferenceDay.date === day
  );
  const schedule = daySchedule
    ? await transformSchedule(daySchedule)
    : undefined;

  return {
    schedule,
    days: sortedDays.map((day) => parse(day.date, "yyyy-MM-dd", new Date())),
  };
};

export type ScheduleDay = Awaited<ReturnType<typeof transformSchedule>>;
export type Schedule = Awaited<ReturnType<typeof fetchSchedule>>;
