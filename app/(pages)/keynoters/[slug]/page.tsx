import {
  fetchKeynoteBySpeakerSlug,
  fetchSessionsInParallel,
} from "@/lib/pretalx/submissions";
import { notFound } from "next/navigation";
import { SessionPage as SessionPageComponent } from "components/session-page";

import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const session = await fetchKeynoteBySpeakerSlug(params.slug);

  if (!session) {
    throw notFound();
  }

  const metadata: Metadata = {
    title: session.title,
    description: session.abstract,
    twitter: {
      card: "summary_large_image",
      title: session.title,
      description: session.abstract,
    },
  };

  return metadata;
};

// export async function generateStaticParams() {
//   const submissions = await fetchConfirmedSubmissions();

//   return submissions.map((submission) => ({
//     slug: submission.slug,
//   }));
// }

export default async function SessionPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await fetchKeynoteBySpeakerSlug(params.slug);
  const sessionsInParallel = await fetchSessionsInParallel(params.slug);

  if (!session) {
    throw notFound();
  }

  return (
    <>
      <SessionPageComponent
        session={session}
        sessionsAfter={[]}
        sessionsInParallel={sessionsInParallel}
      />
      <div className="h-12"></div>
    </>
  );
}
