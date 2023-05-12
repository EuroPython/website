import { Answer } from "./types";
import { slugify } from "./utils/slugify";

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
  room: string;
  room_id: number;
};

const mapSession = (session: Result) => {
  const qa = {
    length: 2360,
    exp: 2363,
  };

  const answersByQuestion = session.answers.reduce((acc, answer) => {
    acc[answer.question.id] = answer.answer;
    return acc;
  }, {} as Record<number, string>);

  const qaLength = answersByQuestion[qa.length] as string | undefined;
  const qaExp = answersByQuestion[qa.exp] as string | undefined;

  return {
    id: session.code,
    code: session.code,
    slug: slugify(session.title),
    title: session.title,
    description: session.description,
    abstract: session.abstract,
    duration: session.duration,
    speakers: session.speakers.map((speaker) => ({
      name: speaker.name,
      avatar: speaker.avatar,
      bio: speaker.biography,
      code: speaker.code,
      slug: slugify(speaker.name),
    })),
    tags: session.tags,
    track: session.track.en,
    type: session.submission_type.en,
    length: qaLength,
    experience: qaExp,
  };
};

export type Session = ReturnType<typeof mapSession>;

export const fetchConfirmedSubmissions = async () => {
  const qs = new URLSearchParams({
    limit: "100",
    state: "confirmed",
    questions: "all",
  });
  let url = `https://pretalx.com/api/events/europython-2023/submissions/?${qs}`;

  let sessions: Result[] = [];

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${process.env.PRETALX_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sessions");
    }

    const data = (await response.json()) as Root;

    sessions = sessions.concat(data.results);

    url = data.next;
  }

  return sessions.map(mapSession);
};
