export type Slots = Record<
  number,
  { time: number; sessions: Session[]; duration: number }
>;

export type Session = {
  id: string;
  title: string;
  day: string;
  time: number;
  endTime: number;
  duration: number;
  slug: string;
  audience?: string;
  rooms: string[];
  type: string;
  speakers: Speaker[];
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

export type BreakTimeSlot = {
  type: "break";
  title: string;
  duration: number;
  time: number;
};

export type SessionsTimeSlot = {
  type: "timeslot";
  duration: number;
  time: number;
  sessions: Session[];
};

export type OrphanTimeSlot = {
  type: "orphan";
  duration: number;
  time: number;
  session: Session;
};

export type TimeSlot = SessionsTimeSlot | BreakTimeSlot | OrphanTimeSlot;

export type Schedule = {
  rooms: string[];
  slots: TimeSlot[];
};
