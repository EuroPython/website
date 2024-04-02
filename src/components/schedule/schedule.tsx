import clsx from "clsx";
import { Break } from "./break";
import { Session } from "./session";
import { formatInTimeZone } from "date-fns-tz";

const ScheduleHeader = ({ rooms }: { rooms: string[] }) => {
  return (
    <div className="hidden md:contents font-bold text-primary divide-x-2 divide-y-2 divide-black">
      <span
        className="text-center sticky z-20 top-0 bg-body-background p-1 border-l-2 border-t-2 border-b-2 border-black"
        style={{
          gridRowStart: 1,
          gridColumn: "1 / 2",
        }}
      >
        Time
      </span>
      {rooms.map((room, index) => (
        <span
          className={clsx(
            "text-center sticky z-20 top-0 bg-body-background p-1 !border-b-2",
            {
              "!border-r-2": index === rooms.length - 1,
            }
          )}
          key={room}
          style={{
            gridRowStart: 1,
            gridColumnStart: index + 2,
            gridColumnEnd: index + 3,
          }}
        >
          {room}
        </span>
      ))}
    </div>
  );
};

export const Schedule = ({
  schedule,
}: {
  schedule: {
    rows: {
      type: "session" | "break";
      title: string;
      time: Date;
      style: {
        gridRowStart: number;
        gridRowEnd: number;
      };
      sessions: {
        title: string;
        start: Date;
        end: Date;
        room: string;
        href: string;
        speakers: {
          name: string;
          slug: string;
        }[];
        customRoom?: string;
        style: {
          gridColumnStart: number;
          gridColumnEnd: number;
        };
        code: string;
        type: string;
      }[];
    }[];
    rooms: string[];
  };
  dayType: "Tutorials" | "Talks";
}) => {
  const rooms = schedule.rooms;
  const totalRooms = rooms.length;

  return (
    <div
      style={{
        gridTemplateColumns: `5rem repeat(${totalRooms}, 1fr)`,
      }}
      className="md:grid my-8 bg-body-background z-10 md:min-w-[1024px] max-w-[1800px] md:mx-auto md:pr-4"
    >
      <ScheduleHeader rooms={rooms} />

      {schedule.rows.map((row, rowIndex) => {
        if (row.type === "break") {
          return (
            <Break
              key={rowIndex}
              title={row.title}
              time={row.time}
              style={row.style}
              className={clsx(
                "border-2 mb-[-2px] md:mb-0 md:border-0 md:border-l-2 md:border-r-2",
                {
                  "md:border-t-2": rowIndex !== 0,
                  "md:border-t-0": rowIndex === 0,
                  "md:border-b-2": rowIndex === schedule.rows.length - 1,
                }
              )}
            />
          );
        }

        const sessions = row.type === "session" ? row.sessions : [];

        return (
          <div className="contents md:divide-y-2 md:divide-x-2 md:divide-black">
            <div
              style={{ ...row.style, gridColumnStart: 1, gridColumnEnd: 2 }}
              className={clsx(
                "md:border-l-2 border-black text-center p-1 font-bold hidden md:block",
                {
                  "md:!border-t-2": rowIndex !== 0,
                  "md:!border-t-0": rowIndex === 0,
                  "md:!border-b-2": rowIndex === schedule.rows.length - 1,
                }
              )}
            >
              {sessions.length >= 1 ? (
                formatInTimeZone(row.time, "Europe/Prague", "HH:mm")
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
            {new Array(rooms.length + 1).fill(null).map((_, index) => {
              return (
                <div
                  className={clsx("hidden md:block", {
                    "!border-r-2": index === totalRooms,
                    "!border-t-2": rowIndex !== 0,
                    "!border-t-0": rowIndex === 0,
                    "!border-b-2": rowIndex === schedule.rows.length - 1,
                  })}
                  style={{
                    gridRowStart: row.style.gridRowStart,
                    gridRowEnd: row.style.gridRowEnd + 1,
                    gridColumnStart: index + 1,
                    gridColumnEnd: index + 2,
                  }}
                ></div>
              );
            })}
            {sessions.map((session, index) => {
              return (
                <div className="md:contents flex mb-[-2px] md:mb-0 ">
                  <div className="md:hidden border-2 flex justify-center p-2 w-[120px] items-center font-bold text-sm">
                    {formatInTimeZone(session.start, "Europe/Prague", "HH:mm")}-{" "}
                    {formatInTimeZone(session.end, "Europe/Prague", "HH:mm")}
                  </div>

                  <Session
                    style={{ ...row.style, ...session.style }}
                    key={index}
                    session={session}
                    className={clsx(
                      "border-2 border-l-0 flex-1 md:border-0 md:border-l-2",
                      {
                        "md:!border-r-2":
                          session.style.gridColumnEnd >= totalRooms + 2,
                        "md:!border-t-2": rowIndex !== 0,
                        "md:!border-t-0": rowIndex === 0,
                        "md:!border-b-2": rowIndex === schedule.rows.length - 1,
                      }
                    )}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
