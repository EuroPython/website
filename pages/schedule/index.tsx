import { Layout } from "../../components/layout";

// these should be sorted
const tracks = [
  "MongoDB",
  "PyCharm",
  "Singapore",
  "Osaka / Samarkand",
  "Shangai",
  "Boston",
  "Help Desk",
  "Poster Session 1",
  "Poster Session 2",
];

type TalkType = "talk" | "workshop" | "keynote";

type EventType = TalkType | "break";

type Event = (
  | {
      type: "break";
    }
  | {
      type: TalkType;
      speakers?: string[];
      audience: "beginner" | "intermediate" | "advanced";
    }
) & {
  id: string;
  day: string;
  time: string;
  endTime: string;
  title: string;
  tracks: string[];
  type?: EventType;
};

const getEvent = ({
  day = "2019-07-10",
  time = "09:00",
  endTime = "09:15",
  title = "Morning announcements Auditorium",
  speakers,
  tracks = ["MongoDB"],
  type = "break",
}: {
  day?: string;
  time?: string;
  endTime?: string;
  title?: string;
  speakers?: string[];
  tracks?: string[];
  type?: EventType;
}): Event => {
  return {
    id: `${day}-${time}-${title}`,
    day,
    time,
    speakers,
    endTime,
    title,
    tracks,
    type,
    audience: "beginner",
  };
};

const getEvents = (
  total: number,
  {
    day,
    time,
    endTime,
  }: {
    day: string;
    time: string;
    endTime: string;
  },
  offset: number = 0
): Event[] => {
  return new Array(total).fill(null).map((_, index) =>
    getEvent({
      day,
      time,
      endTime,
      title: `Talk ${index + 1 + offset}`,
      tracks: [tracks[index + offset]!],
      speakers: [`Speaker ${index + offset}`],
      type: "talk",
    })
  );
};

const schedule: {
  events: Event[];
  tracks: string[];
} = {
  tracks,
  events: [
    getEvent({
      day: "2019-07-10",
      time: "09:00",
      endTime: "09:15",
      tracks: ["MongoDB"],
      type: "break",
    }),
    getEvent({
      day: "2019-07-10",
      time: "09:15",
      endTime: "10:00",
      title: "Getting your data Joie de vivre back",
      speakers: ["Lynn Cherny"],
      tracks: ["MongoDB"],
      type: "keynote",
    }),
    getEvent({
      day: "2019-07-10",
      time: "10:00",
      endTime: "10:30",
      title: "Coffee Break",
      tracks: [
        "MongoDB",
        "PyCharm",
        "Singapore",
        "Osaka / Samarkand",
        "Shangai",
        "Boston",
      ],
      type: "break",
    }),
    ...(getEvents(6, {
      day: "2019-07-10",
      time: "10:30",
      endTime: "11:15",
    }) as any),
    ...(getEvents(6, {
      day: "2019-07-10",
      time: "11:20",
      endTime: "12:05",
    }) as any),
    {
      day: "2019-07-10",
      time: "12:10",
      endTime: "12:50",
      title: "A longer talk",
      tracks: ["MongoDB"],
      type: "talk",
      audience: "advanced",
    },

    ...(getEvents(
      5,
      {
        day: "2019-07-10",
        time: "12:10",
        endTime: "12:40",
      },
      1
    ) as any),
  ],
};

const Talk = ({
  event,
  cols,
}: {
  event: Event & { type: TalkType };
  cols: [number, number];
}) => {
  return (
    <div>
      <div className="talk">
        <p className={`talk__rating ${event.audience}`}>{event.audience}</p>
        <p className="talk__title">
          <a href="session-1.html">{event.title}</a>
        </p>
        <div className="talk__speaker">
          <img src="img/photos/speaker.png" />
          <div className="speaker__bio">
            <span className="speaker__name">{event.speakers?.join(", ")}</span>
            <span className="speaker__title">speaker titles?</span>
          </div>
        </div>
        <div className="talk__mobile-details">{event.tracks.join(", ")}</div>
      </div>
    </div>
  );
};

const Event = ({ event, cols }: { event: Event; cols: [number, number] }) => {
  if (event.type === "break") {
    return (
      <div className="break">
        <span>{event.time}</span>
        <span className="break__description">{event.title}</span>
      </div>
    );
  }

  return <Talk event={event} cols={cols} />;
};

const getColumnsForEvent = (event: Event): [number, number] => {
  // assuming tracks have the same order as the tracks array
  const track = event.tracks[0];
  const trackIndex = schedule.tracks.indexOf(track);
  return [trackIndex + 2, trackIndex + 2 + event.tracks.length];
};

const TimeSlot = ({
  time,
  events,
  row,
}: {
  time: string;
  events: Event[];
  row: number;
}) => {
  // "break" events don't need to show the time as they
  // are basically a separator for the time slots
  if (events.length === 1 && events[0].type === "break") {
    return <Event event={events[0]} cols={[0, 0]} />;
  }

  return (
    <div className="row">
      <div className="talk__time">{time}</div>
      {events.map((event) => {
        const cols = getColumnsForEvent(event);
        return <Event event={event} key={event.id} cols={cols} />;
      })}
    </div>
  );
};

export default function IndexPage({}: {}) {
  // TODO: filter by day, and order by time
  const talks = schedule.events;

  type Slots = Record<string, Event[]>;
  const groups = talks.reduce<Slots>((acc, talk) => {
    const key = talk.time;
    acc[key] = acc[key] || [];
    acc[key].push(talk);
    return acc;
  }, {});

  const totalSlots = Object.keys(groups).length;
  const totalRooms = schedule.tracks.length;

  const gridTemplateRows = Object.entries(groups)
    .map(([time, events]) => {
      if (events.length === 1 && events[0].type === "break") {
        return "70px";
      }

      return "2fr";
    })
    .join(" ");

  return (
    <Layout>
      <main id="main-content">
        <article className="accent-left">
          <h1 className="highlighted">Schedule</h1>
          <p className="large">
            When I hear the buzz of the little world among the stalks.
          </p>
          <p>
            A wonderful serenity has taken possession of my entire soul, like
            these sweet mornings of spring which I enjoy with my whole heart. I
            am alone, and feel the charm of existence in this spot, which was
            created for the bliss of souls like mine.
          </p>
        </article>

        <article>
          <select id="schedule-select" className="select--schedule">
            <option value="schedule-1" selected>
              Monday, 11th July, 2022
            </option>
            <option value="schedule-2">Tuesday, 12th July, 2022</option>
          </select>
        </article>

        <div
          className="full-width schedule__container"
          id="schedule-1"
          style={{
            gridTemplateRows,
            "--total-slots": totalSlots.toString(),
            "--total-rooms": totalRooms.toString(),
          }}
        >
          <div className="schedule">
            <h2 className="h4 schedule__date">Monday, 11th July, 2022</h2>
            <div className="headings">
              <span>Time</span>
              {schedule.tracks.map((track) => (
                <span key={track}>{track}</span>
              ))}
            </div>

            {Object.entries(groups).map(([time, events], index) => (
              <TimeSlot
                time={time}
                events={events}
                key={time}
                row={index + 1}
              />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
