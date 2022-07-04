import React from "react";
import ICalendarLink from "react-icalendar-link";

export const ICALLink = ({
  title,
  description,
  start,
  end,
  url,
}: {
  title: string;
  description: string;
  start: string;
  end: string;
  url: string;
}) => {
  const event = {
    title,
    description,
    startTime: start,
    endTime: end,
    location: url,
  };

  return (
    <ICalendarLink event={event}>
      <span title="Download ical">📆</span>
    </ICalendarLink>
  );
};
