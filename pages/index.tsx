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
      <main id="main-content">
        <Hero />

        <section className="cards">
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
        </section>

        <hr />

        <article className="homepage-cta__right">
          <div>
            <h2 dangerouslySetInnerHTML={{ __html: intro.data.title }}></h2>
            <MDXRemote {...intro.source} />
          </div>
          <div className="cta">
            <h3 className="h4">Be part of EuroPython:</h3>
            <a className="button" href="/sponsor">
              Sponsor our community conference
            </a>
          </div>
        </article>
        <hr />
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
      </main>
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
