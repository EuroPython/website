import { fetchConfirmedSubmissions } from "@/lib/pretix/submissions";
import { Sessions } from "./sessions";

import { Metadata } from "next";

export const revalidate = 300; // 5 minutes

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
