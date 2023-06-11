"use client";

import { Select } from "components/form/select";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const SelectDay = ({ day, days }: { day: string; days: Date[] }) => {
  const router = useRouter();

  const handleDaySelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/schedule/${event.target.value}`);
  };

  return (
    <Select
      id="schedule-select"
      name="schedule-select"
      variant="rounded"
      onChange={handleDaySelected}
      defaultValue={day}
    >
      {days.map((date) => {
        const isoDate = format(date, "yyyy-MM-dd");
        const dateText = format(date, "eeee, do MMMM, yyyy");

        return (
          <option key={isoDate} value={isoDate}>
            {dateText}
            {/* - {type} */}
          </option>
        );
      })}
    </Select>
  );
};
