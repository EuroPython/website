import clsx from "clsx";
import { parseISO } from "date-fns";
import { Datetime } from "../datetime";
import { Break } from "./break";
import { Session } from "./session";
import { numberToTime, timeToNumber } from "./time-helpers";
import type { ScheduleDay } from "@/lib/pretix/schedule";
import { Session as SessionType, TimeSlot } from "./types";

const TalkTime = ({ time }: { time: number }) => {
  const timeAsString = numberToTime(time);

  const isoTime = parseISO(`2022-07-13T${timeAsString}:00+01:00`);

  return (
    <div
      className={clsx(
        "font-bold text-center flex gap-10 justify-center items-center py-3",
        "lg:py-0 lg:flex-col lg:gap-2"
      )}
    >
      <div>
        <Datetime datetime={isoTime} useUserTimezone={false} format={"HH:mm"} />
        <div className="text-xs">(Prague)</div>
      </div>

      <div>
        <Datetime datetime={isoTime} useUserTimezone={true} format={"HH:mm"} />
        <div className="text-xs">(You)</div>
      </div>
    </div>
  );
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

const HEADING_ROWS = 2;
const BREAK_ROWS = 3;
const SESSION_ROWS = 6;
const SESSION_ROWS_TUTORIALS = 3;
const ROW_HEIGHT = 20;

const ScheduleHeader = ({ schedule }: { schedule: ScheduleDay }) => {
  const rooms = Object.keys(schedule.rooms);
  const totalRooms = rooms.length;

  return (
    <div className="hidden lg:contents headings font-bold text-primary">
      <span
        className="schedule-item flex items-center justify-center px-2 py-4 sticky z-20 top-0 self-start bg-body-background"
        style={{
          "--grid-row": `1 / ${HEADING_ROWS + 1}`,
          "--grid-column": "1 / 2",
        }}
      >
        Time
      </span>
      {rooms.map((room, index) => (
        <span
          className="schedule-item flex items-center justify-center px-2 py-4 sticky z-20 top-0 self-start bg-body-background"
          key={room}
          style={{
            "--grid-row": `1 / ${HEADING_ROWS + 1}`,
            "--grid-column": `${index + 2}/${index + 3}`,
          }}
        >
          {room}
        </span>
      ))}
      <span
        className="schedule-item bg-text sticky z-10 top-0 self-start"
        style={{
          "--grid-row": `1 / ${HEADING_ROWS + 1}`,
          "--grid-column": `1 / ${totalRooms + 2}`,
        }}
      >
        &nbsp;
      </span>
    </div>
  );
};

const MINUTES_PER_ROW = 5;
// TODO: better way for this, this offset is to account
// for the header (and +1 since css grids are 1-indexed)
const ROW_OFFSET = 4;

export const Schedule = ({
  schedule,
  dayType,
}: {
  schedule: ScheduleDay;
  dayType: "Tutorials" | "Talks";
}) => {
  const { grid } = schedule;

  const lastTime = schedule.endsAt;

  return (
    <div>
      <div
        className="lg:grid gap-4 my-8"
        style={{
          gridTemplateRows: `repeat(${grid.rows}, ${ROW_HEIGHT}px)`,
          gridTemplateColumns: `5rem repeat(${schedule.totalRooms}, 1fr)`,
        }}
      >
        <ScheduleHeader schedule={schedule} />

        <ul className="contents">
          {Object.entries(grid.times).map(([time, { startRow, endRow }]) => {
            console.log(time);
            return (
              <li
                style={{
                  gridRowStart: startRow + ROW_OFFSET,
                  gridRowEnd: endRow + ROW_OFFSET,
                  gridColumn: "1 / 2",
                }}
              >
                {time}
              </li>
            );
          })}
        </ul>

        {Object.entries(schedule.rooms).map(([room, slots], index) => {
          return (
            <ul className="contents">
              {slots.map((slot) => {
                const start = numberToTime(slot.start);

                const row = grid.times[start];

                if (!row) {
                  console.log("no row for", start);
                  return null;
                }

                return (
                  <Session
                    session={slot}
                    style={{
                      gridColumnStart: index + 2,
                      gridColumnEnd: index + 3,
                      gridRowStart: row.startRow + ROW_OFFSET,
                      gridRowEnd: Math.floor(
                        row.startRow +
                          ROW_OFFSET +
                          slot.duration / MINUTES_PER_ROW
                      ),
                    }}
                  >
                    {slot.title}
                  </Session>
                );
              })}
            </ul>
          );
        })}

        <Break
          title={"End of day"}
          time={lastTime}
          style={{
            // "--grid-row": `${rowSizes.length + 1} / ${rowSizes.length + 2}`,
            "--grid-column": `1 / ${schedule.totalRooms + 2}`,
          }}
        />
      </div>
    </div>
  );
};

const getRowSizeForBreak = (duration: number) => {
  return Math.ceil(BREAK_ROWS * (duration / 30));
};

const getRowSizeForSessionsSlot = (
  duration: number,
  dayType: "Tutorials" | "Talks"
) => {
  const base = dayType === "Tutorials" ? SESSION_ROWS_TUTORIALS : SESSION_ROWS;

  return Math.ceil(base * (duration / 30));
};

const getRowSizeForSlot = (
  slot: {
    duration: number;
    // type: string;
  },
  dayType: "Tutorials" | "Talks"
) => {
  // if (slot.type === "break") {
  //   return getRowSizeForBreak(slot.duration);
  // }

  // if (slot.type === "orphan") {
  //   return 0;
  // }

  return getRowSizeForSessionsSlot(slot.duration, dayType);
};

const getGridMetrics = (
  slots: { duration: number }[],
  dayType: "Tutorials" | "Talks"
) => {
  const rowSizes = slots.map((slot) => getRowSizeForSlot(slot, dayType));

  // this also includes the rooms row
  const gridTemplateRows = [HEADING_ROWS]
    .concat(rowSizes)
    .filter((size) => size > 0)
    .map((size) => {
      return `repeat(${size}, ${ROW_HEIGHT}px)`;
    })
    .join(" ");

  return { gridTemplateRows, rowSizes };
};
