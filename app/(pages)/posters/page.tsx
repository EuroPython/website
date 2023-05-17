import { fetchConfirmedSubmissions } from "@/lib/pretix/submissions";
import { Sessions } from "../sessions/sessions";

export const revalidate = 300; // 5 minutes

export default async function SessionsPage() {
  const sessions = await fetchConfirmedSubmissions();

  return (
    <>
      <Sessions sessions={sessions} type="poster" />
      <div className="h-12"></div>
    </>
  );
}
