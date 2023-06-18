import clsx from "clsx";
import { Break } from "./break";
import { Schedule as ScheduleType } from "@/lib/pretalx/schedule";
import { Session } from "./session";

const ROW_HEIGHT = 40;

const MINUTES_PER_ROW = 5;
const HEADING_ROWS = 1;
const ROW_OFFSET = 1 + HEADING_ROWS;

const ScheduleHeader = ({ rooms }: { rooms: string[] }) => {
  return (
    <>
      <span
        className="schedule-item font-bold text-primary border-black flex items-center justify-center sticky z-20 top-0 self-start bg-body-background h-full"
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
          className="schedule-item font-bold text-primary border-black flex items-center justify-center sticky z-20 top-0 self-start bg-body-background h-full"
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

      {schedule.rows.map((row, index) => {
        if (row.type === "break") {
          return (
            <Break
              key={index}
              title={row.title}
              time={row.time}
              style={row.style}
            />
          );
        }

        const sessions = row.type === "session" ? row.sessions : [];

        return (
          <div className="contents">
            <div style={{ ...row.style, gridColumnStart: 1, gridColumnEnd: 2 }}>
              {row.time}
            </div>
            {sessions.map((session, index) => {
              return (
                <Session
                  style={{ ...row.style, ...session.style }}
                  key={index}
                  session={session}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
