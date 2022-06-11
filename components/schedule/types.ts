export type Slots = Record<
  number,
  { time: number; sessions: Session[]; duration: number }
>;

export type Session = {
  id: string;
  title: string;
  time: number;
  endTime: number;
  duration: number;
  slug: string;
  abstract: string;
  submission_type: string;
  track: string;
  rooms: string[],
  type: string;
  speakers: Speaker[];
  abstractSource: any;
  code: string;
};

export type Schedule = {
  rooms: string[];
  events: Session[];
  timeslots: Slots;
};

export type TalkType = "talk" | "tutorial" | "talk-remote";

export type SessionType =
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

// export type Session = (
//   | {
//       type: "break";
//     }
//   | {
//       type: "unknown";
//     }
//   | {
//       type: "lighting-talks";
//     }
//   | {
//       type: TalkType;
//       speakers?: Speaker[];
//       audience: string;
//       slug: string;
//     }
// ) & {
//   id: string;
//   day: string;
//   time: string;
//   endTime: string;
//   title: string;
//   rooms: string[];
//   type?: SessionType;
// };
