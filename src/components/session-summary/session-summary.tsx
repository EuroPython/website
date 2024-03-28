// import { Prose } from "../prose/prose.astro";
import { TagContainer, Tag } from "../tag/tag";
import { Title } from "../typography/title";
// import ReactMarkdown from "react-markdown";

// import { components } from "../mdx";
import { Fragment } from "react";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const SessionSummary = ({
  session,
}: {
  session: {
    title: string;
    code: string;
    abstract: string;
    slug: string;
    speakers: {
      name: string;
      code?: string;
      slug: string;
    }[];
    type: string;
    track?: string;
    experience?: string;
  };
}) => {
  return (
    <div className="mt-12">
      <Title level={2} highlighted className="!mb-6">
        <a
          href={`/session/${session.slug}`}
          className="!text-inherit hover:underline"
        >
          {session.title}
        </a>
      </Title>
      <p className="text-lg font-bold mb-4">
        {session.speakers.map((speaker, index) => (
          <Fragment key={speaker.slug}>
            <a
              href={`/speaker/${speaker.slug}`}
              className="text-primary underline"
            >
              {speaker.name}
            </a>
            {index < session.speakers.length - 1 && ", "}
          </Fragment>
        ))}
      </p>

      {/* <Prose> */}
      {/* TODO: reuse prose thingy */}
      {/* <ReactMarkdown components={{}}> */}
      {session.abstract}
      {/* </ReactMarkdown> */}
      {/* </Prose> */}

      <TagContainer>
        <Tag>{session.type}</Tag>
        {session.experience && <Tag>{capitalize(session.experience)}</Tag>}

        {session.track && <Tag>{session.track}</Tag>}
      </TagContainer>
    </div>
  );
};
