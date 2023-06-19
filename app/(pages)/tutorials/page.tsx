import { fetchConfirmedSubmissions } from "@/lib/pretalx/submissions";
import { Sessions } from "../sessions/sessions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorials",
};

export default async function SessionsPage() {
  const sessions = await fetchConfirmedSubmissions();

  return (
    <>
      <Sessions sessions={sessions} type="tutorial" />
      <div className="h-12"></div>
    </>
  );
}
