"use client";

import { Label } from "components/form/label";
import { Select } from "components/form/select";
import { SessionSummary } from "components/session-summary/session-summary";
import { Title } from "components/typography/title";
import { useMemo, useState } from "react";
import { Session } from "@/lib/pretalx/submissions";

export const Sessions = ({
  sessions,
  type,
}: {
  sessions: Session[];
  type?: "poster" | "talk" | "tutorial";
}) => {
  const submissionTypes = useMemo(
    () => [...new Set(sessions.map((session) => session.type))],
    [sessions]
  );
  const tracks = useMemo(
    () => [...new Set(sessions.map((session) => session.track))],
    []
  );

  const [filters, setFilters] = useState({
    track: "",
    type: type || "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((preFilters) => ({
      ...preFilters,
      [e.target.name]: e.target.value.toLowerCase(),
    }));
  };

  const filteredSessions = sessions.filter((session) => {
    if (filters.track && filters.track !== session.track?.toLowerCase()) {
      return false;
    }
    if (filters.type && filters.type !== session.type.toLowerCase()) {
      return false;
    }

    if (session.type.toLowerCase() === "announcements") {
      return false;
    }

    if (
      session.title.toLowerCase().includes("lightning talks") ||
      session.title.toLowerCase().includes("sprint orientation")
    ) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <Title>
        Accepted {type ? type : "sessions"}
        <p className="text-base mt-2 text-black">
          Note: this list might change
        </p>
      </Title>

      <form>
        <Title level={2}>Filters</Title>
        <div className="mb-4">
          <Label htmlFor="track">Track</Label>
          <Select name="track" id="track" onChange={handleFilterChange}>
            <option value="">All</option>
            {tracks.map((track) => (
              <option
                key={track}
                value={track}
                selected={track?.toLowerCase() === filters.track}
              >
                {track}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Submission type</Label>
          <Select name="type" id="type" onChange={handleFilterChange}>
            <option value="">All</option>
            {submissionTypes.map((submissionType) => (
              <option
                key={submissionType}
                value={submissionType}
                selected={submissionType.toLowerCase() === filters.type}
              >
                {submissionType}
              </option>
            ))}
          </Select>
        </div>
      </form>

      {filteredSessions.length ? (
        filteredSessions.map((session) => (
          <SessionSummary key={session.code} session={session} />
        ))
      ) : (
        <Title level={3} className="mt-8">
          No sessions found
        </Title>
      )}
    </div>
  );
};
