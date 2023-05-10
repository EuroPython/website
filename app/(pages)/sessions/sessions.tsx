"use client";

import { Label } from "components/form/label";
import { Select } from "components/form/select";
import { SessionSummary } from "components/session-summary/session-summary";
import { Title } from "components/typography/title";
import { useState } from "react";
import { Session } from "./pretix";

export const Sessions = ({ sessions }: { sessions: Session[] }) => {
  const submissionTypes = [...new Set(sessions.map((session) => session.type))];
  const tracks = [...new Set(sessions.map((session) => session.track))];

  const [filters, setFilters] = useState({
    track: "",
    type: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((preFilters) => ({
      ...preFilters,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <Title>
        Accepted sessions
        <p className="font-normal text-base mt-4">
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
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="tyle">Submission type</Label>
          <Select name="tyle" id="tyle" onChange={handleFilterChange}>
            <option value="">All</option>
            {submissionTypes.map((submissionType) => (
              <option key={submissionType} value={submissionType}>
                {submissionType}
              </option>
            ))}
          </Select>
        </div>
      </form>

      {sessions
        .filter((session) => {
          if (filters.track && filters.track !== session.track) {
            return false;
          }
          if (filters.type && filters.type !== session.type) {
            return false;
          }
          return true;
        })
        .map((session) => (
          <SessionSummary key={session.code} session={session} />
        ))}
    </div>
  );
};
