import { fetchConfirmedSubmissions } from "@/lib/pretalx/submissions";
import { Sessions } from "../sessions/sessions";

export const revalidate = 0;

export default async function SessionsPage() {
  const sessions = await fetchConfirmedSubmissions();

  return (
    <>
      <Sessions sessions={sessions} type="poster" />
      <div className="h-12"></div>
    </>
  );
}
