// we use the schedule API only for the breaks because it is not fully

import { parseISO, addHours } from "date-fns";

// public, so it might change in the future
interface Root {
  breaks: Break[];
}

interface Break {
  room: {
    en: string;
  };
  room_id: number;
  start: string;
  end: string;
  description: {
    en: string;
  };
}

export async function getScheduleBreaks() {
  const response = await fetch(
    "https://pretalx.com/api/events/europython-2023/schedules/latest/"
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = (await response.json()) as Root;

  return data.breaks.map((b) => ({
    ...b,
    start: addHours(parseISO(b.start), 1),
    end: addHours(parseISO(b.end), 1),
  }));
}
