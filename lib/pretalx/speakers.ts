import { fetchConfirmedSubmissions, fetchKeynotes } from "./submissions";
import { Answer } from "../pretalx/types";
import { slugify } from "./utils/slugify";
import { fetchWithToken } from "./utils/fetch";
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
    defaultDomain &&
    (url.includes(`https://${defaultDomain}`) ||
      url.includes(`https://www.${defaultDomain}`));
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

const mapSpeaker = (
  speaker: Speaker,
  sessions: {
    title: string;
    slug: string;
  }[]
) => {
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
    sessions,
  };
};

export const fetchSpeakersWithConfirmedSubmissions = async () => {
  const submissions = (
    await Promise.all([fetchConfirmedSubmissions(), fetchKeynotes()])
  ).flat();

  const allSpeakers = Array.from(
    new Set(submissions.map((submission: any) => submission.speakers).flat())
  );

  const seen = new Set();

  return allSpeakers.filter((speaker) => {
    const duplicate = seen.has(speaker.code);
    seen.add(speaker.code);
    return !duplicate;
  });
};

export const fetchSpeakerBySlug = async (slug: string) => {
  if (!process.env.ALL_SPEAKERS_URL) {
    return null;
  }

  const allSpeakers = await fetchSpeakersWithConfirmedSubmissions();

  const speakerInfo = allSpeakers.find((speaker) => speaker.slug === slug);

  if (!speakerInfo) {
    return null;
  }

  const allSpeakersData = await fetch(process.env.ALL_SPEAKERS_URL!).then(
    (res) => res.json()
  );

  const speaker = allSpeakersData.find(
    (speaker) => speaker.code === speakerInfo.code
  );

  const confirmedSubmissions = await fetchConfirmedSubmissions();

  const submissions = confirmedSubmissions.filter((submission) =>
    submission.speakers.some((speaker) => speaker.code === speakerInfo.code)
  );

  return mapSpeaker(speaker, submissions);
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
