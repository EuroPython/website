import { serialize } from "next-mdx-remote/serialize";

import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../components/layout";
import { Hero } from "../components/hero";
import { Card } from "../components/card";
import matter from "gray-matter";
import { Sponsors } from "../components/sponsors";
import { Fullbleed } from "components/layout/fullbleed";
import { CardContainer } from "components/card/card-container";
import { HeroWithCTA } from "components/hero-section/hero-with-cta";
import { ButtonLink } from "components/button-link";
import { HeroVenue } from "components/hero-section/hero-venue";
import { Title } from "components/typography/title";
import { Prose } from "components/prose/prose";
import { MDXRemote } from "components/mdx-remote/mdx-remote";
import { Keynoters } from "components/keynoters/keynoters";

export const metadata = {
  metadataBase: new URL("https://ep2023.europython.eu"),
  title:
    "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
  description: "",
};

export default async function IndexPage() {
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

  const introText = await fs.readFile(
    path.join(process.cwd(), "data/home/intro.md"),
    "utf8"
  );
  const data = matter(introText);
  const introSource = await serialize(data.content);

  const venueText = await fs.readFile(
    path.join(process.cwd(), "data/home/venue.md"),
    "utf8"
  );
  const venueData = matter(venueText);
  const venueSource = await serialize(venueData.content);

  const venue = {
    source: venueSource,
    data: venueData.data,
  };

  const intro = {
    source: introSource,
    data: data.data,
  };

  return (
    <Layout headerInverted={true}>
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

      <div className="mt-40 px-6">
        <HeroWithCTA
          ctaTitle="The Sprint Weekend is On"
          ctaButton={
            <ButtonLink href="/sprints">Submit your sprint now!</ButtonLink>
          }
        >
          <Title>
            <div dangerouslySetInnerHTML={{ __html: intro.data.title }}></div>
          </Title>

          <Prose>
            <MDXRemote {...intro.source} />
          </Prose>
        </HeroWithCTA>
      </div>

      <div className="mt-40 mb-40 px-6">
        <HeroVenue title={venue.data.title}>
          <MDXRemote {...venue.source} />
        </HeroVenue>
      </div>

      <Keynoters />

      <Sponsors />
    </Layout>
  );
}
