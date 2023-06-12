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

const ROW_HEIGHT = 40;

const MINUTES_PER_ROW = 5;
const HEADING_ROWS = 1;
const ROW_OFFSET = 1 + HEADING_ROWS;

const ScheduleHeader = ({ schedule }: { schedule: ScheduleDay }) => {
  const rooms = Object.keys(schedule.rooms);

  return (
    // <div className="hidden lg:contents headings divide-x-2 divide-black border-b-2">
    <>
      <span
        className="schedule-item border-l-2 border-t-2 border-b-2 font-bold text-primary border-black flex items-center justify-center sticky z-20 top-0 self-start bg-body-background h-full"
        style={{
          gridRowStart: 1,
          gridRowEnd: HEADING_ROWS + 1,
          gridColumn: "1 / 2",
        }}
      >
        Time
      </span>
      {rooms.map((room, index) => (
        <span
          className="schedule-item !border-b-2 font-bold text-primary border-black flex items-center justify-center sticky z-20 top-0 self-start bg-body-background h-full"
          key={room}
          style={{
            gridRowStart: 1,
            gridRowEnd: HEADING_ROWS + 1,
            gridColumnStart: index + 2,
            gridColumnEnd: index + 3,
          }}
        >
          {room}
        </span>
      ))}
    </>
    // </div>
  );
};

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
        className="lg:grid my-8 border-b-2 border-r-2"
        style={{
          gridTemplateRows: `repeat(${grid.rows}, ${ROW_HEIGHT}px)`,
          gridTemplateColumns: `5rem repeat(${schedule.totalRooms}, 1fr)`,
        }}
      >
        <ul className="contents divide-x-2 divide-y-2">
          <ScheduleHeader schedule={schedule} />

          {Object.entries(grid.times).map(
            ([time, { startRow, endRow }], index) => {
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
                    className={clsx(
                      "text-center p-1 font-bold border-l-2 border-t-2",
                      {
                        "!border-t-0": index === 0,
                      }
                    )}
                  >
                    {time}
                  </li>

                  {Object.keys(schedule.rooms).map((room, roomIndex) => {
                    return (
                      <li
                        key={room}
                        style={{
                          gridRowStart,
                          gridRowEnd,
                          gridColumnStart: roomIndex + 2,
                          gridColumnEnd: roomIndex + 3,
                        }}
                        className={clsx({
                          "!border-t-0": index === 0,
                        })}
                      ></li>
                    );
                  })}
                </>
              );
            }
          )}
        </ul>

        {Object.entries(schedule.rooms).map(([room, slots], roomIndex) => {
          return (
            <ul className="contents">
              {slots.map((slot, index) => {
                const start = numberToTime(slot.start);

                const row = grid.times[start];

                if (!row) {
                  console.log("no row for", start);
                  return null;
                }

                const rowIndex = Object.values(grid.times).indexOf(row);

                return (
                  <Session
                    session={slot}
                    style={{
                      marginTop: rowIndex === 0 ? -1 : undefined,
                      gridColumnStart: roomIndex + 2,
                      gridColumnEnd: roomIndex + 3,
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
