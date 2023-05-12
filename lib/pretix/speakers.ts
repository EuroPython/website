import { Answer } from "./types";
import { slugify } from "./utils/slugify";

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
    });

    if (!response.ok) {
      throw new Error("Failed to fetch speakers");
    }

    const data = (await response.json()) as Root;

    speakers = speakers.concat(data.results);

    url = data.next;
  }

  return speakers.map(mapSpeaker);
};

export const fetchSpeakerBySlug = async (slug: string) => {
  const allSpeakers = await fetchAllSpeakers();

  return allSpeakers.find((speaker) => speaker.slug === slug);
};
