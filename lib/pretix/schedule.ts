import { parse } from "date-fns";
import { fetchConfirmedSubmissions } from "./submissions";
import { fetchSpeakersWithConfirmedSubmissions } from "./speakers";
import { timeToNumber } from "components/schedule/time-helpers";

export type ScheduleResponse = {
  schedule: Schedule;
};

export type Schedule = {
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

const transformSchedule = async (schedule?: Day) => {
  if (!schedule) {
    return;
  }

  const allSubmissions = await fetchConfirmedSubmissions();
  const allSpeakers = await fetchSpeakersWithConfirmedSubmissions();
  const codeToSubmission = Object.fromEntries(
    allSubmissions.map((submission) => [submission.code, submission])
  );
  const codeToSpeaker = Object.fromEntries(
    allSpeakers.map((speaker) => [speaker.code, speaker])
  );

  Object.values(schedule.rooms).forEach((sessions) => {
    sessions.forEach((session) => {
      // add the end time here
      // TODO: fix types
      const start = timeToNumber(session.start);
      const duration = timeToNumber(session.duration);
      session.end = start + duration;

      // parse https://program.europython.eu/europython-2023/talk/CRTSNK/
      // if it exists
      if (!session.url) {
        return;
      }

      const urlPieces = session.url.split("/");
      const code = urlPieces[urlPieces.length - 2];

      const submission = codeToSubmission[code];

      if (!submission) {
        // TODO: keynotes?
        console.log(`Couldn't find ${session.url}`);

        return;
      }

      session.experience = submission.experience;

      session.persons.forEach((person) => {
        const speaker = codeToSpeaker[person.code];

        if (speaker) {
          person.slug = speaker.slug;
        }
      });

      return session;
    });
  });

  console.log(Object.values(schedule.rooms).flatMap((session) => session));

  const endsAt = Math.max(
    ...Object.values(schedule.rooms).flatMap((session) => session.end)
  );

  return { ...schedule, endsAt };
};

export const fetchSchedule = async (day: string) => {
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

  const schedule = await transformSchedule(
    conference.days.find((conferenceDay) => conferenceDay.date === day)
  );

  return {
    schedule,
    days: sortedDays.map((day) => parse(day.date, "yyyy-MM-dd", new Date())),
  };
};
