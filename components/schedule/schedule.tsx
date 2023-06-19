import clsx from "clsx";
import { Break } from "./break";
import { Schedule as ScheduleType } from "@/lib/pretalx/schedule";
import { Session } from "./session";

const ScheduleHeader = ({ rooms }: { rooms: string[] }) => {
  return (
    <div className="contents font-bold text-primary divide-x-2 divide-y-2 divide-black">
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
  schedule: ScheduleType;
  dayType: "Tutorials" | "Talks";
}) => {
  const rooms = schedule.rooms;
  const totalRooms = rooms.length;

  return (
    <div
      style={{
        gridTemplateColumns: `5rem repeat(${totalRooms}, 1fr)`,
      }}
      className="lg:grid my-8 bg-body-background z-10"
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
              className={clsx("border-l-2 border-r-2", {
                "border-t-2": rowIndex !== 0,
                "border-t-0": rowIndex === 0,
                "border-b-2": rowIndex === schedule.rows.length - 1,
              })}
            />
          );
        }

        const sessions = row.type === "session" ? row.sessions : [];

        return (
          <div className="contents divide-y-2 divide-x-2 divide-black">
            <div
              style={{ ...row.style, gridColumnStart: 1, gridColumnEnd: 2 }}
              className={clsx(
                "border-l-2 border-black text-center p-1 font-bold",
                {
                  "!border-t-2": rowIndex !== 0,
                  "!border-t-0": rowIndex === 0,
                  "!border-b-2": rowIndex === schedule.rows.length - 1,
                }
              )}
            >
              {sessions.length >= 1 ? row.time : <span>&nbsp;</span>}
            </div>
            {new Array(rooms.length + 1).fill(null).map((_, index) => {
              return (
                <div
                  className={clsx({
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
                <Session
                  style={{ ...row.style, ...session.style }}
                  key={index}
                  session={session}
                  className={clsx("border-l-2", {
                    "!border-r-2":
                      session.style.gridColumnEnd === totalRooms + 2,
                    "!border-t-2": rowIndex !== 0,
                    "!border-t-0": rowIndex === 0,
                    "!border-b-2": rowIndex === schedule.rows.length - 1,
                  })}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
