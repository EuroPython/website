import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../components/layout";
import { Hero } from "../components/hero";
import { Card } from "../components/card";
import matter from "gray-matter";

type Deadline = {
  content: string;
  data: {
    title: string;
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
      <Hero />

      <section className="cards">
        {deadlines.map(({ data, content }) => (
          <Card
            key={data.title}
            title={data.title}
            subtitle={data.subtitle}
            content={content}
          />
        ))}
      </section>

      <hr />

      <article className="homepage-cta__right">
        <div>
          <h2>{intro.data.title}</h2>
          <MDXRemote {...intro.source} />
        </div>
        <div className="cta">
          <h3 className="h4">See schedule:</h3>
          <a className="button" href="#">
            Coming soon
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

          <iframe
            src={venue.data.map}
            title="Map"
            width="600"
            height="450px"
            style={{
              border: "0",
              margin: "2rem 0 0",
              height: 350,
            }}
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      </article>
      <hr />
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
