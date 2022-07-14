import React from "react";
import ICalendarLink from "react-icalendar-link";

export const ICALLink = ({
  title,
  description,
  start,
  end,
  room,
  url,
  className,
}: {
  title: string;
  description: string;
  start: string;
  end: string;
  url: string;
  room: string;
  className?: string;
}) => {
  const event = {
    title,
    description: url + "\n\n" + description,
    startTime: start,
    endTime: end,
    location: room,
  };

  return (
    <ICalendarLink event={event} className={className}>
      <span title="Download ical">📆</span>
    </ICalendarLink>
  );
};
