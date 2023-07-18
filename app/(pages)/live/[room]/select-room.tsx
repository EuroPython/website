"use client";

import { Select } from "components/form/select";
import { useCallback } from "react";

export const SelectRoom = ({
  room,
  rooms,
}: {
  room: { slug: string; name: string };
  rooms: { slug: string; name: string }[];
}) => {
  const handleRoomSelected = useCallback((event: any) => {
    window.location.href = `/live/${event.target.value}`;
  }, []);

  return (
    <Select
      id="schedule-select"
      name="schedule-select"
      onChange={handleRoomSelected}
      defaultValue={room.slug}
    >
      {rooms.map(({ slug, name }) => {
        return (
          <option key={slug} value={slug}>
            {name}
          </option>
        );
      })}
    </Select>
  );
};
