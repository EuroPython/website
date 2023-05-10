import { Prose } from "components/prose/prose";
import { TagContainer, Tag } from "components/tag/tag";
import { Title } from "components/typography/title";
import { MDXRemote } from "next-mdx-remote";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const SessionSummary = ({
  session,
}: {
  session: {
    title: string;
    code: string;
    speakers: {
      name: string;
      code?: string;
    }[];
    type: string;
    // abstractSource: any;
    track: string;
    experience?: string;
  };
}) => {
  return (
    <div className="mt-12">
      <Title level={2} highlighted className="!mb-6">
        <a
          href={`/session/${session.code}`}
          className="hover:text-primary-hover"
        >
          {session.title}
        </a>
      </Title>
      <p className="text-lg font-bold mb-4">
        {session.speakers.map((speaker, index) => (
          <>
            <a
              href={speaker.code ? `/speaker/${speaker.code}` : ""}
              className="text-primary underline"
            >
              {speaker.name}
            </a>
            {index < session.speakers.length - 1 && ", "}
          </>
        ))}
      </p>

      <Prose>{/* <MDXRemote {...session.abstractSource} /> */}</Prose>

      <TagContainer>
        <Tag>{session.type}</Tag>
        {session.experience && <Tag>{capitalize(session.experience)}</Tag>}

        <Tag>{session.track}</Tag>
      </TagContainer>
    </div>
  );
};
