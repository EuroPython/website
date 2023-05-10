import { Prose } from "components/prose/prose";
import { TagContainer, Tag } from "components/tag/tag";
import { Title } from "components/typography/title";
import ReactMarkdown from "react-markdown";

import { components } from "components/mdx";
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
    speakers: {
      name: string;
      code?: string;
    }[];
    type: string;
    track: string;
    experience?: string;
  };
}) => {
  return (
    <div className="mt-12">
      <Title level={2} highlighted className="!mb-6">
        <a href={`/session/${session.code}`} className="!text-inherit hover:underline">
          {session.title}
        </a>
      </Title>
      <p className="text-lg font-bold mb-4">
        {session.speakers.map((speaker, index) => (
          <Fragment key={speaker.code}>
            <a
              href={speaker.code ? `/speaker/${speaker.code}` : ""}
              className="text-primary underline"
            >
              {speaker.name}
            </a>
            {index < session.speakers.length - 1 && ", "}
          </Fragment>
        ))}
      </p>

      <Prose>
        <ReactMarkdown components={components}>
          {session.abstract}
        </ReactMarkdown>
      </Prose>

      <TagContainer>
        <Tag>{session.type}</Tag>
        {session.experience && <Tag>{capitalize(session.experience)}</Tag>}

        <Tag>{session.track}</Tag>
      </TagContainer>
    </div>
  );
};
