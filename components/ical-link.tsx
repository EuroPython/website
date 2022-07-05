import React from "react";
import ICalendarLink from "react-icalendar-link";

export const ICALLink = ({
  title,
  description,
  start,
  end,
  url,
  className,
}: {
  title: string;
  description: string;
  start: string;
  end: string;
  url: string;
  className?: string;
}) => {
  const event = {
    title,
    description,
    startTime: start,
    endTime: end,
    location: url,
  };

  return (
    <ICalendarLink event={event} className={className}>
      <span title="Download ical">📆</span>
    </ICalendarLink>
  );
};
