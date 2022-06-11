import { Break } from "./break";
import { Session } from "./session";
import { numberToTime, timeToNumber } from "./time-helpers";
import {
  Schedule as ScheduleType,
  Session as SessionType,
  Slots,
} from "./types";

const ROW_HEIGHT = 25;
const BREAK_ROWS = 3;
const SESSION_ROWS = 8;

const getColumnForSession = (session: { rooms: string[] }, rooms: string[]) => {
  const roomIndexes = session.rooms.map((room) => rooms.indexOf(room)).sort();
  const firstRoomIndex = roomIndexes[0];

  // css grids are 1-indexed, plus we have the time column on the left
  const start = 2 + firstRoomIndex;
  const end = start + roomIndexes.length;

  return { start, end };
};

const getRowForTimeSlot = (index: number, rowSizes: number[]) => {
  // css grids are 1-indexed, plus we have the rooms rows on the top
  const start =
    BREAK_ROWS + rowSizes.slice(0, index).reduce((acc, curr) => acc + curr, 0);

  const end = start + rowSizes[index];

  return { start, end };
};

const map = (
  value: number,

  from: { low: number; high: number },
  to: { low: number; high: number }
) => {
  return (
    to.low + ((to.high - to.low) * (value - from.low)) / (from.high - from.low)
  );
};

const getRowForOrphan = (
  session: { time: number },
  rowSizes: number[],
  slots: any[]
) => {
  const slotsBefore = slots.filter(
    (slot) => slot.type !== "orphan" && slot.time < session.time
  );
  const slotsAfter = slots.filter(
    (slot) => slot.type !== "orphan" && slot.time > session.time
  );

  const slotBefore = slotsBefore[slotsBefore.length - 1];
  const slotBeforeIndex = slots.indexOf(slotBefore);

  const timeDifferenceBefore = session.time - slotBefore.time;
  const rowDifferenceBefore = Math.floor(
    map(
      timeDifferenceBefore,
      { low: 0, high: slotBefore.duration },
      { low: 0, high: getRowSizeForSlot(slotBefore) }
    )
  );

  const start =
    2 +
    rowSizes.slice(0, slotBeforeIndex).reduce((acc, curr) => acc + curr, 0) +
    rowDifferenceBefore;

  const slotAfter = slotsAfter[0];
  const slotAfterIndex = slots.indexOf(slotAfter);

  const timeDifferenceAfter = slotAfter.time - session.time;
  const rowDifferenceAfter = Math.floor(
    map(
      timeDifferenceAfter,
      { low: 0, high: slotAfter.duration },
      { low: 0, high: getRowSizeForSlot(slotAfter) }
    )
  );
  const end =
    2 +
    rowSizes.slice(0, slotAfterIndex).reduce((acc, curr) => acc + curr, 0) +
    rowDifferenceAfter;

  return { start, end };
};

const ScheduleSlot = ({
  slot,
  rooms,
  style,
}: {
  slot: { time: number; sessions: SessionType[] };
  rooms: string[];

  style: React.CSSProperties;
}) => {
  return (
    <div className="row">
      <div
        className="talk__time"
        style={{
          "--grid-column": "1 / 2",
          ...style,
        }}
      >
        {numberToTime(slot.time)}
      </div>

      {slot.sessions.map((session) => {
        const column = getColumnForSession(session, rooms);

        return (
          <Session
            key={session.id}
            session={session}
            style={{
              ...style,
              "--grid-column": `${column.start} / ${column.end}`,
            }}
          />
        );
      })}
    </div>
  );
};

const Orphan = ({
  session,
  rooms,
  style,
}: {
  session: SessionType;
  rooms: string[];
  style: React.CSSProperties;
}) => {
  const column = getColumnForSession(session, rooms);

  return (
    <Session
      key={session.id}
      session={session}
      style={{
        "--grid-column": `${column.start} / ${column.end}`,
        ...style,
      }}
    />
  );
};

export const Schedule = ({
  schedule,
}: {
  schedule: {
    parts: any;
    rooms: string[];
  };
}) => {
  const totalRooms = schedule.rooms.length;
  const { rowSizes, gridTemplateRows } = getGridMetrics(schedule);

  return (
    <div className="full-width schedule__container">
      <div
        className="schedule"
        style={{
          gridTemplateRows,
          "--total-rooms": totalRooms.toString(),
        }}
      >
        <h2 className="h4 schedule__date">Monday, 11th July, 2022 TODO</h2>
        <div className="headings">
          <span
            style={{
              "--grid-row": `1 / ${BREAK_ROWS}`,
              "--grid-column": "1 / 2",
            }}
          >
            Time
          </span>
          {schedule.rooms.map((track, index) => (
            <span
              key={track}
              style={{
                "--grid-row": `1 / ${BREAK_ROWS}`,
                "--grid-column": `${index + 2}/${index + 3}`,
              }}
            >
              {track}
            </span>
          ))}
        </div>

        {schedule.parts.map((slot, index) => {
          const row = getRowForTimeSlot(index, rowSizes);

          const style = {
            "--grid-row": `${row.start} / ${row.end}`,
          };

          if (slot.type === "break") {
            return <Break title={slot.title} time={slot.time} style={style} />;
          }

          if (slot.type === "orphan") {
            const session = slot.sessions[0];
            const row = getRowForOrphan(session, rowSizes, schedule.parts);

            return (
              <Orphan
                session={session}
                rooms={schedule.rooms}
                style={{
                  "--grid-row": `${row.start} / ${row.end}`,
                }}
              />
            );
          }

          return (
            <ScheduleSlot slot={slot} rooms={schedule.rooms} style={style} />
          );
        })}
      </div>
    </div>
  );
};

const getRowSizeForSlot = (slot: { duration: number; type: string }) => {
  if (slot.type === "break") {
    return Math.ceil(BREAK_ROWS * (slot.duration / 30));
  }

  if (slot.type === "orphan") {
    return 0;
  }

  return SESSION_ROWS;
};

const getGridMetrics = (schedule: { parts: any; rooms: string[] }) => {
  const rowSizes = schedule.parts.map(getRowSizeForSlot);

  // this also includes the rooms row
  const gridTemplateRows = [1]
    .concat(rowSizes)
    .filter((size) => size > 0)
    .map((size) => {
      return `repeat(${size}, ${ROW_HEIGHT}px)`;
    })
    .join(" ");

  return { gridTemplateRows, rowSizes };
};
