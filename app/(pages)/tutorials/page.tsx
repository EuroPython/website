import { fetchConfirmedSubmissions } from "@/lib/pretix/submissions";
import { Sessions } from "../sessions/sessions";

export default async function SessionsPage() {
  const sessions = await fetchConfirmedSubmissions();

  return (
    <>
      <Sessions sessions={sessions} type="tutorial" />
      <div className="h-12"></div>
    </>
  );
}
