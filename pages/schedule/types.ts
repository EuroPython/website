import type { Event } from "../../types/schedule";

export type Slots = Record<string, Event[]>;

export type Schedule = {
  rooms: string[];
  events: Event[];
  timeslots: Slots;
};
