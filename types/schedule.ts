export type TalkType = "talk" | "tutorial" | "talk-remote";

export type EventType =
  | TalkType
  | "break"
  | "lighting-talks"
  | "poster"
  | "panel"
  | "open-space";

export type Speaker = {
  name: string;
  tagline?: string;
  image?: string;
};

export type Event = (
  | {
      type: "break";
    }
  | {
      type: "unknown";
    }
  | {
      type: "lighting-talks";
    }
  | {
      type: TalkType;
      speakers?: Speaker[];
      audience: string;
      slug: string;
    }
) & {
  id: string;
  day: string;
  time: string;
  endTime: string;
  title: string;
  rooms: string[];
  type?: EventType;
};
