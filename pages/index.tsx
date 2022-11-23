import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../components/layout";
import { Hero } from "../components/hero";
import { Map } from "../components/map";
import { Card } from "../components/card";
import matter from "gray-matter";
import { Sponsors } from "../components/sponsors";
import { Keynoters } from "../components/keynoters";
import { Fullbleed } from "components/layout/fullbleed";
import { Separator } from "components/separator/separator";
import { CardContainer } from "components/card/card-container";

type Deadline = {
  content: string;
  data: {
    title: string;
    image: string;
    url: string;
    subtitle: string;
  };
};

type Intro = {
  source: any;
  data: {
    title: string;
  };
};

type Venue = {
  source: any;
  data: {
    title: string;
    map: string;
  };
};

export default function IndexPage({
  deadlines,
  intro,
  venue,
}: {
  deadlines: Deadline[];
  intro: Intro;
  venue: Venue;
}) {
  return (
    <Layout>
      <Fullbleed>
        <Hero />
      </Fullbleed>

      <CardContainer>
        {deadlines.map(({ data, content }) => (
          <Card
            key={data.title}
            image={data.image}
            url={data.url}
            title={data.title}
            subtitle={data.subtitle}
            content={content}
          />
        ))}
      </CardContainer>

      <Separator />

      <article className="homepage-cta__right">
        <div>
          <h2
            className="text-7xl font-bold"
            dangerouslySetInnerHTML={{ __html: intro.data.title }}
          ></h2>
          <div className="prose-lg prose-li:m-0 prose-ul:m-0 prose-ul:mb-4 prose-li:list-disc">
            <MDXRemote {...intro.source} />
          </div>
        </div>
        <div className="cta">
          <h3 className="h4">Watch EuroPython Live Streams:</h3>
          <a
            className="button"
            href="https://youtube.com/playlist?list=PL8uoeex94UhFzv6hQ_V02xfMCcl8sUr4p"
            target="_blank"
          >
            Enjoy the party of Python!
          </a>
        </div>
      </article>

      <Separator />
      <article className="homepage-cta__venue">
        <div>
          <img src="/img/venue.png" className="image--1" alt="" />
          <img src="/img/burst.png" className="image--2" alt="" />
          <img src="/img/photo.png" className="image--3" alt="" />
          <img src="/img/map.png" className="image--4" alt="" />
        </div>
        <div>
          <h2>{venue.data.title}</h2>
          <MDXRemote {...venue.source} />
          <a className="button" href="/where">
            Read more
          </a>
          <Map />
        </div>
      </article>
      <Separator />

      <Keynoters />
      <Sponsors />
    </Layout>
  );
}

export async function getStaticProps() {
  const basePath = path.join(process.cwd(), "data/deadlines");
  const paths = await fs.readdir(basePath);
  const deadlines = await Promise.all(
    paths.map(async (filename) => {
      const str = await fs.readFile(path.join(basePath, filename), "utf8");

      const frontmatter = matter(str);

      return {
        content: frontmatter.content,
        data: frontmatter.data,
      };
    })
  );

  const intro = await fs.readFile(
    path.join(process.cwd(), "data/home/intro.md"),
    "utf8"
  );
  const data = matter(intro);
  const introSource = await serialize(data.content);

  const venue = await fs.readFile(
    path.join(process.cwd(), "data/home/venue.md"),
    "utf8"
  );
  const venueData = matter(venue);
  const venueSource = await serialize(venueData.content);

  return {
    props: {
      deadlines,
      intro: {
        source: introSource,
        data: data.data,
      },
      venue: {
        source: venueSource,
        data: venueData.data,
      },
    },
  };
}
