import { Response } from "./schedule-types";

export type Schedule = {
  rooms: string[];
  rows: Row[];
};

type Row = {
  time: string;
  type: "break" | "session";
} & (
  | {
      type: "break";
      title: string;
      style: RowStyle & ColumnStyle;
    }
  | {
      type: "session";
      sessions: Session[];
      style: RowStyle;
    }
);

type Session = {
  title: string;
  speakers: string[];
  room: string;
  style: ColumnStyle;
};

type ColumnStyle = {
  gridColumnStart: number;
  gridColumnEnd: number;
};

type RowStyle = {
  gridRowStart: number;
  gridRowEnd: number;
};

// This API is not public, so it might change in the future
export async function getSchedule() {
  //   const response = await fetch(
  //     "https://pretalx.com/api/events/europython-2023/schedules/latest/"
  //   );

  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }

  //   const data = (await response.json()) as Response;

  const rooms = ["Room 1", "Room 2", "Room 3"];


  const rows = [
    {
      time: "09:00",
      type: "break",
      title: "Breakfast",
      style: {
        gridColumnStart: 1,
        gridColumnEnd: rooms.length + 1,
        gridRowStart: 1,
        gridRowEnd: 2,
      },
    },
    {
      time: "10:00",
      type: "session",
      style: {
        gridRowStart: 1,
        gridRowEnd: 2,
      },
      sessions: [
        {
          title: "Session 1",
          speakers: ["Speaker 1"],
          room: "Room 1",
          style: {
            gridColumnStart: 1,
            gridColumnEnd: rooms.length + 1,
          },
        },
        {
          title: "Session 2",
          speakers: ["Speaker 2"],
          room: "Room 2",
          style: {
            gridColumnStart: 1,
            gridColumnEnd: rooms.length + 1,
          },
        },
        {
          title: "Session 3",
          speakers: ["Speaker 3"],
          room: "Room 3",
          style: {
            gridColumnStart: 1,
            gridColumnEnd: rooms.length + 1,
          },
        },
      ],
    },
  ];

  const currentRow = null;

  // ... fill rows with style

  return {
    rooms: rooms,
    rows,
  } as Schedule;
}
