import type { Event } from "../../types/schedule";

import {
  timeToNumber,
  numberToTime,
} from "../../components/schedule/time-helpers";
import { Schedule, Slots } from "./types";

const TYPES_MAP = {
  "Talk [in-person]": "talk",
  "Talk [remote]": "talk-remote",
  "Poster [in-person]": "poster",
  "Tutorial [in-person]": "tutorial",
};

const AUDIENCE_MAP = {
  none: "beginner",
  some: "intermediate",
  expert: "advanced",
};

type Position = {
  rows: { start: number; end: number };
  cols: {
    start: number;
    end: number;
  };
};

export const getScheduleForDay = async ({
  schedule,
  day,
}: {
  schedule: any;
  day: string;
}) => {
  let currentDay = schedule.days[day];

  // @ts-ignore, we'll add types later
  const events: Event[] = currentDay.talks.map((event, index) => {
    const time = timeToNumber(event.time);
    const evDuration = parseInt(event.ev_duration || "0", 10);
    const ttDuration = parseInt(event.tt_duration || "0", 10);

    const endTime = time + (evDuration || ttDuration);
    // @ts-ignore we should improve the API
    let eventType = TYPES_MAP[event.type] || "";
    const title = event.title || event.ev_custom;

    if (eventType === "") {
      const lowerTitle = title.toLocaleLowerCase();
      if (lowerTitle === "coffee break" || lowerTitle === "lunch break") {
        eventType = "break";
      } else {
        console.log(eventType, event);
      }
    }

    return {
      id: index.toString(),
      title,
      day: event.day,
      time: event.time,
      endTime: numberToTime(endTime),
      // @ts-ignore we should improve the API
      audience: AUDIENCE_MAP[event.level] || "",
      rooms: event.rooms,
      slug: event.slug || "",
      type: eventType,
      speakers: [
        {
          name: event.speaker,
        },
      ],
    };
  });

  const timeslots = events.reduce<Slots>((acc, talk) => {
    const key = talk.time;
    acc[key] = acc[key] || [];
    acc[key].push(talk);
    return acc;
  }, {});

  return {
    rooms: currentDay.rooms,
    events,
    timeslots,
  };
};

export const getPositionForEvent = (
  event: Event,
  schedule: Schedule
): Position => {
  const startTime = timeToNumber(event.time);
  const endTime = timeToNumber(event.endTime);

  const timeSlotsNumbers = Object.keys(schedule.timeslots).map((time) =>
    timeToNumber(time)
  );

  // startTime will always be present in timeSlots, since they are created based on
  // startTimes
  const startTimeIndex = timeSlotsNumbers.indexOf(startTime);
  // endTime might not be there because talks will potentially end before the next startTime
  const timeSlotAfterEnd = timeSlotsNumbers.find((t) => t >= endTime);

  // assuming rooms have the same order as the rooms array
  const track = event.rooms[0];
  const trackIndex = schedule.rooms.indexOf(track);

  // we have the heading and css grid indexes start at 1
  const rowsOffset = 2;

  // we have the time and css grid indexes start at 1
  const colsOffset = 2;

  return {
    rows: {
      start: startTimeIndex + rowsOffset,
      end:
        (timeSlotAfterEnd
          ? timeSlotsNumbers.indexOf(timeSlotAfterEnd)
          : startTimeIndex + 1) + rowsOffset,
    },
    cols: {
      start: trackIndex + colsOffset,
      end: trackIndex + colsOffset + event.rooms.length,
    },
  };
};
