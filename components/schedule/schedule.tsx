import clsx from "clsx";
import { parseISO } from "date-fns";
import { Datetime } from "../datetime";
import { Break } from "./break";
import { Session } from "./session";
import { numberToTime } from "./time-helpers";
import type { ScheduleDay } from "@/lib/pretix/schedule";

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

const HEADING_ROWS = 2;
const ROW_HEIGHT = 40;

const ScheduleHeader = ({ schedule }: { schedule: ScheduleDay }) => {
  const rooms = Object.keys(schedule.rooms);

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
    </div>
  );
};

const MINUTES_PER_ROW = 5;
const ROW_OFFSET = 1;

export const Schedule = ({
  schedule,
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
          // gridTemplateRows: `repeat(${grid.rows}, ${ROW_HEIGHT}px)`,
          gridTemplateColumns: `5rem repeat(${schedule.totalRooms}, 1fr)`,
        }}
      >
        <ScheduleHeader schedule={schedule} />
      </div>

      <div
        className="lg:grid my-8 border-b-2 border-r-2"
        style={{
          gridTemplateRows: `repeat(${grid.rows}, ${ROW_HEIGHT}px)`,
          gridTemplateColumns: `5rem repeat(${schedule.totalRooms}, 1fr)`,
        }}
      >
        <ul className="contents divide-x-2 divide-y-2">
          {Object.entries(grid.times).map(([time, { startRow, endRow }]) => {
            const gridRowStart = startRow + ROW_OFFSET;
            const gridRowEnd = endRow + ROW_OFFSET;

            return (
              <>
                <li
                  style={{
                    gridRowStart,
                    gridRowEnd,
                    gridColumn: "1 / 2",
                  }}
                  className="text-center p-1 font-bold border-l-2 border-t-2"
                >
                  {time}
                </li>

                {Object.keys(schedule.rooms).map((room, index) => {
                  return (
                    <li
                      key={room}
                      style={{
                        gridRowStart,
                        gridRowEnd,
                        gridColumnStart: index + 2,
                        gridColumnEnd: index + 3,
                      }}
                    ></li>
                  );
                })}
              </>
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
                  />
                );
              })}
            </ul>
          );
        })}

        {/* <Break
          title={"End of day"}
          time={lastTime}
          style={{
            // "--grid-row": `${rowSizes.length + 1} / ${rowSizes.length + 2}`,
            "--grid-column": `1 / ${schedule.totalRooms + 2}`,
          }}
        /> */}
      </div>
    </div>
  );
};
