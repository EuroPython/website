import { isAfter, isEqual, parseISO } from "date-fns";
import { Answer } from "../pretalx/types";
import { slugify, slugifySession } from "./utils/slugify";
import { fetchWithToken } from "./utils/fetch";
import { cache } from "react";

export type Root = {
  count: number;
  next: any;
  previous: any;
  results: Result[];
};

export type Result = {
  code: string;
  speakers: Speaker[];
  title: string;
  submission_type: { en: string };
  track: { en: string };
  submission_type_id: number;
  state: string;
  abstract: string;
  description: string;
  duration: number;
  do_not_record: boolean;
  is_featured: boolean;
  content_locale: string;
  slot: Slot;
  slot_count: number;
  image: string;
  answers: Answer[];
  notes: string;
  internal_notes: string;
  tags: string[];
  tag_ids: number[];
};

export type Speaker = {
  name: string;
  code: string;
  biography: string;
  avatar: string;
};

export type Slot = {
  start: string;
  end: string;
  room: {
    en: string;
  } | null;
  room_id: number | null;
};

const mapSession = (session: Result) => {
  const qa = {
    length: 2360,
    exp: 2363,
    tagline: 2645,
    customRoom: 2700,
  };

  const answersByQuestion = session.answers.reduce((acc, answer) => {
    acc[answer.question.id] = answer.answer;
    return acc;
  }, {} as Record<number, string>);

  const qaLength = answersByQuestion[qa.length] as string | undefined;
  const qaExp = answersByQuestion[qa.exp] as string | undefined;
  const qaTagline = answersByQuestion[qa.tagline] as string | undefined;
  const qaCustomRoom = answersByQuestion[qa.customRoom] as string | undefined;

  let sessionType = session.submission_type.en;

  if (session.submission_type.en === "Sponsored" && session.duration === 30) {
    sessionType = "Talk";
  }

  const start = session.slot?.start ? parseISO(session.slot.start) : null;
  const end = session.slot?.end ? parseISO(session.slot.end) : null;

  let room = session.slot?.room?.en;
  if (session.title.toLowerCase().includes("registration")) {
    room = "Registration hall";
  }

  return {
    id: session.code,
    code: session.code,
    slug: slugifySession({ title: session.title, start }),
    title: session.title,
    description: session.description,
    abstract: session.abstract,
    duration: session.duration * (session.slot_count || 1),
    speakers: session.speakers.map((speaker) => ({
      name: speaker.name,
      avatar: speaker.avatar,
      bio: speaker.biography,
      code: speaker.code,
      slug: slugify(speaker.name),
    })),
    tagline: qaTagline,
    tags: session.tags,
    track: session.track?.en,
    type: sessionType,
    length: qaLength,
    experience: qaExp,
    slidesUrl: null,
    start,
    end,
    room,
    customRoom: qaCustomRoom,
  };
};

export type Session = ReturnType<typeof mapSession>;

export const fetchConfirmedSubmissions = cache(async () => {
  const qs = new URLSearchParams({
    limit: "200",
    state: "confirmed",
    questions: "all",
  });
  let url = `https://pretalx.com/api/events/europython-2023/submissions/?${qs}`;

  let sessions: Result[] = [];

  while (url) {
    const response = await fetchWithToken(url, {
      next: {
        revalidate: 300,
      },
    });

    const data = (await response.json()) as Root;

    sessions = sessions.concat(data.results);

    url = data.next;
  }

  // remove duplicates by code
  const seen = new Set();
  sessions = sessions.filter((session) => {
    const duplicate = seen.has(session.code);
    seen.add(session.code);
    return !duplicate;
  });

  // filter out sessions that have placeholder in the title
  sessions = sessions.filter(
    (session) => !session.title.toLowerCase().includes("placeholder")
  );

  return sessions.map(mapSession);
});

export const fetchSubmissionBySlug = cache(async (slug: string) => {
  const allSessions = await fetchConfirmedSubmissions();

  return allSessions.find((session) => session.slug === slug);
});

export const fetchKeynotes = cache(async () => {
  // https://pretalx.com/api/events/europython-2023/submissions/?content_locale=&submission_type=2752
  const qs = new URLSearchParams({
    limit: "200",
    questions: "all",
    submission_type: "2752",
  });

  let url = `https://pretalx.com/api/events/europython-2023/submissions/?${qs}`;

  // there's only one page (keynotes are usually less than 10 :D)
  const response = await fetchWithToken(url, {
    next: {
      revalidate: 300,
    },
  });

  const data = (await response.json()) as Root;

  return data.results.map(mapSession);
});

export const fetchKeynoteBySpeakerSlug = cache(async (slug: string) => {
  const allKeynotes = await fetchKeynotes();

  return allKeynotes.find((keynote) =>
    keynote.speakers.some((speaker) => speaker.slug === slug)
  );
});

export const fetchSessionsInParallel = cache(async (slug: string) => {
  const confirmedSubmissions = await fetchConfirmedSubmissions();
  const session = confirmedSubmissions.find((session) => session.slug === slug);

  if (!session) {
    return [];
  }

  return confirmedSubmissions.filter(
    (s) =>
      session.id != s.id &&
      session.start &&
      s.start &&
      isEqual(s.start, session.start)
  );
});

export const fetchSessionsAfter = cache(async (slug: string) => {
  const confirmedSubmissions = await fetchConfirmedSubmissions();
  const session = confirmedSubmissions.find((session) => session.slug === slug);

  if (!session) {
    return [];
  }

  if (!session.start) {
    return [];
  }

  const allStartTimes = (
    confirmedSubmissions.map((s) => s.start).filter(Boolean) as Date[]
  ).sort((a, b) => a.getTime() - b.getTime());

  const nextStartTime = allStartTimes.find((start) =>
    isAfter(start, session.start!)
  );

  if (!nextStartTime) {
    return [];
  }

  return confirmedSubmissions.filter(
    (s) => s.start && isEqual(s.start, nextStartTime)
  );
});
