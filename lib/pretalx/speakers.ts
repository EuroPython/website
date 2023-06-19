import { fetchConfirmedSubmissions, fetchKeynotes } from "./submissions";
import { Answer } from "../pretix/types";
import { slugify } from "./utils/slugify";
import { cache } from "react";

type Availability = {
  id: number;
  start: string;
  end: string;
  allDay: boolean;
};

type Speaker = {
  code: string;
  name: string;
  biography: string;
  submissions: string[];
  avatar: string;
  answers: Answer[];
  availabilities: Availability[];
};

type Root = {
  count: number;
  next: null | string;
  previous: null | string;
  results: Speaker[];
};

const normalizeUrl = (url?: string, defaultDomain?: string) => {
  if (!url) {
    return undefined;
  }

  const hasDefaultDomain =
    defaultDomain && url.includes(`https://${defaultDomain}`);
  const hasNoDomain = !url.includes("/") && !defaultDomain;

  if (hasDefaultDomain || hasNoDomain) {
    return url;
  }

  const domain = defaultDomain ? `${defaultDomain}/` : "";
  const prefix = url.startsWith("http") ? "" : "https://";

  return `${prefix}${domain}${url}`;
};
const normalizeGithub = (github?: string) => {
  return normalizeUrl(github, "github.com");
};

const normalizeLinkedin = (linkedin?: string) => {
  return normalizeUrl(linkedin, "linkedin.com/in");
};

const mapSpeaker = (speaker: Speaker) => {
  const qa = {
    company: 2346,
    job: 2348,
    homepage: 239,
    github: 2352,
    linkedin: 2353,
  };

  const answersByQuestion = speaker.answers.reduce((acc, answer) => {
    acc[answer.question.id] = answer.answer;
    return acc;
  }, {} as Record<number, string>);

  return {
    code: speaker.code,
    name: speaker.name,
    slug: slugify(speaker.name),
    biography: speaker.biography,
    avatar: speaker.avatar,
    company: answersByQuestion[qa.company],
    job: answersByQuestion[qa.job],
    homepage: normalizeUrl(answersByQuestion[qa.homepage]),
    github: normalizeGithub(answersByQuestion[qa.github]),
    linkedin: normalizeLinkedin(answersByQuestion[qa.linkedin]),
  };
};

// TODO: don't use this, it is slow and fetches all the speakers
// not just the ones that have confirmed submissions
export const fetchAllSpeakers = async () => {
  const qs = new URLSearchParams({
    limit: "100",
    questions: "all",
  });

  let url:
    | string
    | null = `https://pretalx.com/api/events/europython-2023/speakers/?${qs}`;

  let speakers: Speaker[] = [];

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${process.env.PRETALX_TOKEN}`,
      },
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch speakers");
    }

    const data = (await response.json()) as Root;

    speakers = speakers.concat(data.results);

    url = data.next;
  }

  const seen = new Set();
  speakers = speakers.filter((speaker) => {
    const duplicate = seen.has(speaker.code);
    seen.add(speaker.code);
    return !duplicate;
  });

  return speakers.map(mapSpeaker);
};

export const fetchSpeakersWithConfirmedSubmissions = async () => {
  const submissions = (
    await Promise.all([fetchConfirmedSubmissions(), fetchKeynotes()])
  ).flat();

  const allSpeakers = Array.from(
    new Set(submissions.map((submission) => submission.speakers).flat())
  );

  const seen = new Set();

  return allSpeakers.filter((speaker) => {
    const duplicate = seen.has(speaker.code);
    seen.add(speaker.code);
    return !duplicate;
  });
};

export const fetchSpeakerBySlug = async (slug: string) => {
  const allSpeakers = await fetchSpeakersWithConfirmedSubmissions();

  const speakerInfo = allSpeakers.find((speaker) => speaker.slug === slug);

  if (!speakerInfo) {
    throw new Error("Failed to find speaker in submissions");
  }

  const response = await fetch(
    `https://pretalx.com/api/events/europython-2023/speakers/${speakerInfo.code}/`,
    {
      headers: {
        Authorization: `Token ${process.env.PRETALX_TOKEN}`,
      },
      next: {
        revalidate: 300,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch speaker");
  }

  const speaker = (await response.json()) as Speaker;

  return mapSpeaker(speaker);
};

export const fetchKeynoters = async () => {
  const submissions = await fetchKeynotes();

  const allSpeakers = Array.from(
    new Set(
      submissions
        .map((submission) =>
          submission.speakers.flatMap((speaker) => ({
            ...speaker,
            session: submission,
          }))
        )
        .flat()
    )
  );

  const seen = new Set();

  return allSpeakers.filter((speaker) => {
    const duplicate = seen.has(speaker.code);
    seen.add(speaker.code);
    return !duplicate;
  });
};

export const fetchKeynoterBySlug = async (slug: string) => {
  const allSpeakers = await fetchKeynoters();

  const speakerInfo = allSpeakers.find((speaker) => speaker.slug === slug);

  if (!speakerInfo) {
    throw new Error("Failed to find speaker in submissions");
  }

  const response = await fetch(
    `https://pretalx.com/api/events/europython-2023/speakers/${speakerInfo.code}/`,
    {
      headers: {
        Authorization: `Token ${process.env.PRETALX_TOKEN}`,
      },
      next: {
        revalidate: 300,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch speaker");
  }

  const speaker = (await response.json()) as Speaker;

  return mapSpeaker(speaker);
};
