import { fetchConfirmedSubmissions } from "@/lib/pretix/submissions";
import { Sessions } from "./sessions";

export default async function SessionsPage() {
  const sessions = await fetchConfirmedSubmissions();

  return (
    <>
      <Sessions sessions={sessions} />
      <div className="h-12"></div>
    </>
  );
}
