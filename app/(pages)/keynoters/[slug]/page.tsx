import { format } from "date-fns";
import { Separator } from "components/separator/separator";
import { Title } from "components/typography/title";
import { Prose } from "components/prose/prose";
import { Tag, TagContainer } from "components/tag/tag";
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDescription,
} from "components/definition-list/definition-list";
import {
  fetchConfirmedSubmissions,
  fetchKeynoteBySpeakerSlug,
  fetchSubmissionBySlug,
} from "@/lib/pretix/submissions";
import { notFound } from "next/navigation";
import { Datetime } from "components/datetime";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { components } from "components/mdx";

import { Metadata } from "next";
import Image from "next/image";

export const revalidate = 300; // 5 minutes

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

// TODO: remove code duplication

const getAvatarUrl = (avatar: string) => {
  if (avatar.startsWith("https://www.gravatar.com/avatar/")) {
    return `${avatar}?s=600`;
  }

  return avatar;
};
export default async function SessionPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await fetchKeynoteBySpeakerSlug(params.slug);

  if (!session) {
    throw notFound();
  }

  // TODO: social card
  //   const socialCardUrl = `https://ep2022.europython.eu/api/social-cards/?session=${session.code}`;
  // TODO: once we have the start date and time
  const start = null;

  // @ts-ignore
  const sessionsAfter = [];
  // @ts-ignore
  const sessionsInParallel = [];

  return (
    <>
      <article className="accent-left">
        <header className="mb-6">
          <Title level={2}>{session.title}</Title>
          <DefinitionList>
            {session.room ? (
              <>
                <DefinitionTerm>Room:</DefinitionTerm>
                <DefinitionDescription>{session.room}</DefinitionDescription>
              </>
            ) : null}
            {start ? (
              <>
                <DefinitionTerm>Start (Dublin time):</DefinitionTerm>
                <DefinitionDescription>
                  <Datetime
                    datetime={start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={false}
                  />
                </DefinitionDescription>
                <DefinitionTerm>Start (your time):</DefinitionTerm>
                <DefinitionDescription>
                  <Datetime
                    datetime={start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={true}
                  />
                </DefinitionDescription>
              </>
            ) : null}
            <DefinitionTerm>Duration:</DefinitionTerm>
            <DefinitionDescription>
              {session.duration} minutes
            </DefinitionDescription>
          </DefinitionList>
        </header>

        <Title level={2} className="!mb-6">
          Abstract
        </Title>

        <Prose>
          <ReactMarkdown components={components}>
            {session.abstract}
          </ReactMarkdown>
        </Prose>

        <TagContainer className="mb-6">
          <Tag>{session.type}</Tag>
          {session.track && <Tag>{session.track}</Tag>}
        </TagContainer>

        {session.slidesUrl && (
          <a href={session.slidesUrl} className="button">
            Download slides
          </a>
        )}
        {session.description ? (
          <>
            <Title level={2} className="!mb-6">
              Description
            </Title>

            <Prose>
              <ReactMarkdown components={components}>
                {session.description}
              </ReactMarkdown>
            </Prose>
          </>
        ) : (
          ""
        )}
      </article>

      <Separator />

      <article className="accent-left">
        <Title level={2}>
          The speaker{session.speakers.length > 1 ? "s" : ""}
        </Title>

        {session.speakers.map((speaker) => (
          <div
            key={speaker.code}
            className="mb-4 md:grid grid-cols-[260px_1fr] md:gap-6"
          >
            <div className="flex items-start mb-4">
              <img
                src={getAvatarUrl(speaker.avatar)}
                alt={speaker.name}
                className="w-full max-w-sm mb-12"
              />
            </div>

            <div>
              <p className="mb-4">
                <a
                  href={`/speaker/${speaker.slug}`}
                  className="text-4xl hover:text-primary-hover underline font-bold"
                >
                  {speaker.name}
                </a>
              </p>
              <Prose>
                <ReactMarkdown components={components}>
                  {speaker.bio}
                </ReactMarkdown>
              </Prose>
            </div>
          </div>
        ))}
      </article>
      <div className="h-12"></div>
    </>
  );
}

// export default function Page({
//     source,
//     path,
//     bioSource,
//     slug,
//     data: { title, speaker, affiliation },
//   }: {
//     source: any;
//     bioSource: any;
//     path: string;
//     slug: string;
//     data: {
//       title: string;
//       speaker: string;
//       affiliation?: string;
//     };
//   }) {
//     const keynoter = findKeynoter(speaker)!;
//     const socialCardUrl = `https://ep2022.europython.eu/api/social-cards/?keynoter=${slug}&v2`;

//     return (
//       <Layout
//         path={path}
//         title={`${title} || EuroPython 2022`}
//         socialCardUrl={socialCardUrl}
//       >
//         <main id="main-content" className="px-6">
//           <Title level={2}>{title}</Title>
//           <Title level={3}>
//             <a href="#about">{keynoter.name}</a>
//           </Title>

//           <Prose>
//             <MDXRemote {...source} components={components} />
//           </Prose>

//           <div id="about">
//             <Title level={2}>About the keynoter</Title>
//             <div>
//               <div>
//                 <img src={keynoter.picture} className="w-full max-w-sm mb-12" />
//               </div>

//               <div>
//                 {affiliation ? <div>Affiliation: {affiliation}</div> : null}

//                 <Prose>
//                   <MDXRemote {...bioSource} components={components} />
//                 </Prose>
//               </div>
//             </div>
//           </div>
//         </main>
//       </Layout>
//     );
//   }

//   export async function getStaticPaths() {
//     const pages = (
//       await fs.readdir(path.join(process.cwd(), "data/keynoters"))
//     ).filter((p) => p.endsWith(".md"));
//     const paths = pages.map((page) => ({
//       params: { slug: page.replace(".md", "") },
//     }));
//     return { paths, fallback: "blocking" };
//   }

//   async function serializeWithPlugins(content: string, plugins: any[]) {
//     return await serialize(content, {
//       mdxOptions: {
//         rehypePlugins: [
//           // @ts-ignore
//           rehypeSlug,
//           // @ts-ignore
//           [rehypeAutolinkHeadings, { behavior: "wrap" }],
//           // @ts-ignore
//           [rehypeExternalLinks, { rel: ["nofollow"] }],
//         ],
//         remarkPlugins: plugins,
//       },
//     });
//   }

//   export async function getStaticProps({ params }: { params: { slug: string } }) {
//     const pagePath = `keynoters/${params.slug}`;

//     const markdownPath = path.join(process.cwd(), `data/${pagePath}.md`);

//     const page = await fs.readFile(markdownPath);
//     const { content, data } = matter(page);

//     const mdxSource = await serializeWithPlugins(content.toString(), [
//       wrapInArticles,
//       highlightFirstHeading,
//     ]);
//     const bioSource = await serializeWithPlugins(data.bio, []);

//     return {
//       props: {
//         source: mdxSource,
//         path: pagePath,
//         data,
//         bioSource,
//         slug: params.slug,
//       },
//       revalidate: 60,
//     };
//   }
