import { Prose } from "components/prose/prose";
import { TagContainer, Tag } from "components/tag/tag";
import { Title } from "components/typography/title";
import { MDXRemote } from "next-mdx-remote";

export const SessionSummary = ({
  session,
}: {
  session: {
    title: string;
    slug: string;
    speakers: {
      name: string;
      slug?: string;
    }[];
    submission_type: string;
    abstractSource: any;
    track: string;
  };
}) => {
  return (
    <div className="mt-12">
      <Title level={2} highlighted className="!mb-6">
        <a
          href={`/session/${session.slug}`}
          className="hover:text-primary-hover"
        >
          {session.title}
        </a>
      </Title>
      <p className="text-lg font-bold mb-4">
        {session.speakers.map((speaker, index) => (
          <>
            <a
              href={speaker.slug ? `/speaker/${speaker.slug}` : ""}
              className="text-primary underline"
            >
              {speaker.name}
            </a>
            {index < session.speakers.length - 1 && ", "}
          </>
        ))}
      </p>

      <Prose>
        <MDXRemote {...session.abstractSource} />
      </Prose>

      <TagContainer>
        <Tag>{session.submission_type}</Tag>
        <Tag>{session.track}</Tag>
      </TagContainer>
    </div>
  );
};
