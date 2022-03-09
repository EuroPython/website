import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../components/layout";
import { Hero } from "../components/hero";
import { Card } from "../components/card";

export default function IndexPage({ source }: { source: any }) {
  return (
    <Layout>
      <Hero />

      <section className="cards">
        <Card />
        <Card />
        <Card />
      </section>

      <hr />

      <article className="homepage-cta__right">
        <div>
          <h2>
            EuroPython Dublin. <br />
            You're invited!
          </h2>
          <p>
            Welcome to the 21st EuroPython. We're the oldest and longest running
            volunteer-led Python programming conference on the planet! Join us
            in July in the beautiful and vibrant city of Dublin. We'll be
            together, face to face and online, to celebrate our shared passion
            for Python and its community!
          </p>
          <p>A week of all things Python:</p>
          <ul>
            <li>Monday & Tuesday, 11 & 12 July: Tutorials & Workshops</li>
            <li>
              Wednesday–Friday, 13-15 July: Conference talks & sponsor
              exhibition
            </li>
            <li>Saturday & Sunday, 16 & 17 July : Sprints</li>
          </ul>
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
          <h2>Venue</h2>
          <p>
            The in-person conference will be held at The Convention Centre
            Dublin (The CCD) in Dublin, Ireland. For the virtual conference,
            detailed instructions will be announced at a later time.
          </p>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9526.9707628466!2d-6.2395809!3d53.3478621!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x25faa23c18a1e358!2sThe%20Convention%20Centre%20Dublin!5e0!3m2!1sen!2suk!4v1646755209137!5m2!1sen!2suk"
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
  const faqPath = path.join(process.cwd(), "data/faq.md");

  const content = await fs.readFile(faqPath);
  const mdxSource = await serialize(content.toString());
  return { props: { source: mdxSource } };
}
