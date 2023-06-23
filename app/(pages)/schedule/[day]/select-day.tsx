"use client";

import { Select } from "components/form/select";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";

export const SelectDay = ({
  day,
  days,
}: {
  day: string;
  days: {
    date: Date;
    type: "sprints" | "conference";
  }[];
}) => {
  const router = useRouter();

  const handleDaySelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = days.find(
      (day) =>
        formatInTimeZone(day.date, "Europe/Prague", "yyyy-MM-dd") ===
        event.target.value
    )!.type;

    if (type === "sprints") {
      router.push("/sprints");
    } else {
      router.push(`/schedule/${event.target.value}`);
    }
  };

  return (
    <Select
      id="schedule-select"
      name="schedule-select"
      variant="rounded"
      onChange={handleDaySelected}
      defaultValue={day}
    >
      {days.map(({ date, type }) => {
        const isoDate = formatInTimeZone(date, "Europe/Prague", "yyyy-MM-dd");
        const dateText = formatInTimeZone(
          date,
          "Europe/Prague",
          "eeee, do MMMM, yyyy"
        );

        return (
          <option key={isoDate} value={isoDate}>
            {dateText} {type === "sprints" ? "(sprints)" : null}
          </option>
        );
      })}
    </Select>
  );
};
