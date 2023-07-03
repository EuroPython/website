import { fetchConfirmedSubmissions } from "@/lib/pretalx/submissions";
import { Sessions } from "./sessions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions",
};

export default async function SessionsPage() {
  const sessions = await fetchConfirmedSubmissions();

  return (
    <>
      <Sessions sessions={sessions} />
      <div className="h-12"></div>
    </>
  );
}
