import {
  addMinutes,
  addDays,
  differenceInMinutes,
  format,
  isSameDay,
  parseISO,
} from "date-fns";
import { Response } from "./schedule-types";
import { timeToNumber } from "components/schedule/time-helpers";
import { slugify } from "./utils/slugify";
import { fetchConfirmedSubmissions } from "./submissions";

export type Schedule = {
  rooms: string[];
  rows: Row[];
  days: Date[];
};

type BreakRow = {
  type: "break";
  title: string;
  duration: number;
  style: RowStyle & ColumnStyle;
};
type SessionRow = {
  type: "session";
  sessions: Session[];
  style: RowStyle;
};

type Row = {
  time: string;
  type: "break" | "session" | "empty";
} & (
  | BreakRow
  | SessionRow
  | {
      type: "empty";
      style: RowStyle;
    }
);

export type Session = {
  title: string;
  speakers: {
    name: string;
    slug: string;
  }[];
  room: string;
  style: ColumnStyle & RowStyle;
  type: string;
  experience: string;
  duration: number;
  slug: string;
  start: string;
  end: string;
  slots: number;
  isCopy?: boolean;
};

type ColumnStyle = {
  gridColumnStart: number;
  gridColumnEnd: number;
};

type RowStyle = {
  gridRowStart: number;
  gridRowEnd: number;
};

const getRooms = async () => {
  // rooms in the schedule API are not ordered so we use the ones from the
  // export API instead
  const response = await fetch(
    "https://program.europython.eu/europython-2023/schedule/export/schedule.json"
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  return data.schedule.conference.rooms.map(
    (room: { name: string }) => room.name
  ) as string[];
};

// This API is not public, so it might change in the future
export async function getScheduleDays() {
  const response = await fetch(
    "https://pretalx.com/api/events/europython-2023/schedules/latest/"
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = (await response.json()) as Response;

  return Array.from(
    new Set(
      data.slots.map((item) => format(parseISO(item.slot.start), "yyyy-MM-dd"))
    )
  )
    .map((day) => parseISO(day))
    .sort((a, b) => a.getTime() - b.getTime());
}

// This API is not public, so it might change in the future
export async function getSchedule(day: string) {
  const allSubmissions = await fetchConfirmedSubmissions();

  const codeToSubmission = Object.fromEntries(
    allSubmissions.map((submission) => [submission.code, submission])
  );

  const response = await fetch(
    "https://pretalx.com/api/events/europython-2023/schedules/latest/"
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = (await response.json()) as Response;
  const date = parseISO(day);

  const orderedRooms = await getRooms();

  const items = data.slots
    .filter((item) => isSameDay(date, parseISO(item.slot.start)))
    .filter((item) => !item.title.toLowerCase().includes("placeholder"));
  const breaks = data.breaks.filter((item) =>
    isSameDay(date, parseISO(item.start))
  );

  const roomsForDay = Array.from(
    new Set(items.flatMap((item) => item.slot.room.en))
  );
  const rooms = orderedRooms.filter((room) => roomsForDay.includes(room));

  const getColumns = (room: string) => {
    const index = rooms.indexOf(room);
    return {
      gridColumnStart: index + 2,
      gridColumnEnd: index + 3,
    };
  };

  const slotsByTime = items.reduce((acc, item) => {
    const time = format(parseISO(item.slot.start), "HH:mm");
    const timeEnd = format(parseISO(item.slot.end), "HH:mm");

    if (!acc[time]) {
      acc[time] = [];
    }

    // remove this if it is in a break?
    if (!acc[timeEnd]) {
      acc[timeEnd] = [];
    }

    acc[time].push(item);

    return acc;
  }, {} as { [key: string]: typeof items });

  const breaksByTime = breaks.reduce((acc, item) => {
    const time = format(parseISO(item.start), "HH:mm");

    if (!acc[time]) {
      acc[time] = [];
    }

    acc[time].push(item);

    return acc;
  }, {} as { [key: string]: typeof breaks });

  let currentRow = 2;

  const sessionWithMultipleSlots: Session[] = [];

  const bareRows = Object.entries(slotsByTime)
    .map(([time, slots]) => {
      if (slots.length === 0) {
        return {
          time,
          type: "empty",
        } as Row;
      }

      return {
        time,
        type: "session",
        sessions: slots.map((slot) => {
          const submission = codeToSubmission[slot.code];

          const session = {
            title: slot.title,
            speakers: slot.speakers.map((speaker) => ({
              name: speaker.name,
              slug: slugify(speaker.name),
            })),
            duration: slot.duration * slot.slot_count,
            room: slot.slot.room.en,
            type: slot.submission_type.en,
            slug: slugify(slot.title),
            start: slot.slot.start,
            end: slot.slot.end,
            experience: submission.experience,
            slots: slot.slot_count,
          } as Session;

          if (slot.slot_count > 1) {
            sessionWithMultipleSlots.push(session);
          }

          return session;
        }),
      } as Row;
    })
    .concat(
      Object.entries(breaksByTime).map(([time, breaks]) => {
        const duration = differenceInMinutes(
          parseISO(breaks[0].end),
          parseISO(breaks[0].start)
        );

        return {
          time,
          type: "break",
          title: breaks[0].description.en,
          duration: duration,
        } as Row;
      })
    )
    .filter((row) => {
      if (row.type !== "empty") {
        return true;
      }

      if (!breaksByTime[row.time]) {
        return true;
      }

      return false;
    })
    .sort((a, b) => {
      return timeToNumber(a.time) - timeToNumber(b.time);
    });

  let currentRowMap = 2;

  sessionWithMultipleSlots.forEach((session) => {
    let start = parseISO(session.start);

    // starting from one since we already have the first slot
    // inside the schedule
    for (let i = 1; i < session.slots; i++) {
      const end = addMinutes(start, session.duration / session.slots);

      const endString = format(end, "HH:mm");

      // this is a bit fragile, but it should work as usually sessions with
      // multiple slots are divided by breaks
      const row = bareRows.find(
        (row) => row.type === "break" && row.time === endString
      ) as BreakRow | undefined;

      if (!row) {
        console.log("no row found for", session.title);
        return;
      }

      start = addMinutes(end, row.duration);
      const breakIndex = bareRows.indexOf(row as Row);

      // find the next row that has the same start time
      const nextRow = bareRows.find(
        (row) => row.type === "session" && row.time === format(start, "HH:mm")
      ) as SessionRow | undefined;

      const newSession = {
        ...session,
        start: start.toISOString(),
        end: addMinutes(start, session.duration / session.slots).toISOString(),
        isCopy: true,
      };

      if (!nextRow) {
        bareRows.splice(breakIndex + 1, 0, {
          time: format(start, "HH:mm"),
          type: "session",
          sessions: [newSession],
        } as Row);
      } else {
        nextRow.sessions.push(newSession);
      }
    }
  });

  const rowTimeMap = Object.fromEntries(
    bareRows.map((row) => {
      const time = row.time;

      currentRowMap += 1;

      return [time, currentRowMap - 1];
    })
  );

  const rows = bareRows.map((row) => {
    if (row.type === "break") {
      row.style = {
        gridColumnStart: 1,
        gridColumnEnd: rooms.length + 2,
        gridRowStart: rowTimeMap[row.time],
        gridRowEnd: rowTimeMap[row.time] + 1,
      };
    } else {
      row.style = {
        gridRowStart: rowTimeMap[row.time],
        gridRowEnd: rowTimeMap[row.time] + 1,
      };

      if (row.type === "session") {
        row.sessions = row.sessions.map((session) => {
          const start = format(parseISO(session.start), "HH:mm");
          const end = format(parseISO(session.end), "HH:mm");

          session.style = {
            ...getColumns(session.room),
            gridRowStart: rowTimeMap[start],
            gridRowEnd: rowTimeMap[end],
          };

          return session;
        });
      }
    }

    currentRow += 1;

    return row;
  });

  const days = Array.from(
    new Set(
      data.slots.map((item) => format(parseISO(item.slot.start), "yyyy-MM-dd"))
    )
  )
    .map((day) => ({
      date: parseISO(day),
      type: "conference",
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const lastDay = days[days.length - 1].date;

  days.push({
    date: addDays(lastDay, 1),
    type: "sprints",
  });
  days.push({
    date: addDays(lastDay, 2),
    type: "sprints",
  });

  return {
    rooms: rooms,
    rows,
    days,
  } as Schedule;
}
