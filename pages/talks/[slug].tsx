import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../../components/layout";
import { wrapInArticles } from "../../plugins/wrap-in-articles";
import { highlightFirstHeading } from "../../plugins/highlight-first-heading";

import { components } from "../../components/mdx";

export default function Page({ path }: { path: string }) {
  return (
    <Layout path={path}>
      <main id="main-content">
        <article className="accent-left">
          <h1 className="highlighted">Schedule</h1>
          <h2>Boost your Python and Machine Learning algorithms</h2>
          <p>
            <strong>Course content</strong>
          </p>
          <p>
            <span className="tag">Analytics</span>
            <span className="tag">Data Science</span>
            <span className="tag">Machine Learning</span>
            <span className="tag">Performance</span>
            <span className="tag">Scientific Libraries</span>
          </p>
          <p>
            A wonderful serenity has taken possession of my entire soul, like
            these sweet mornings of spring which I enjoy with my whole heart. I
            am alone, and feel the charm of existence in this spot, which was
            created for the bliss of souls like mine.
          </p>
          <a href="/" className="button">
            View all classes
          </a>
          <a href="/" className="button">
            Download slides
          </a>
        </article>

        <hr />

        <article className="accent-left">
          <h2 className="h5">The speaker</h2>
          <img
            className="session__speaker-image"
            src="https://avatars.dicebear.com/api/adventurer/Gpcjwb.svg"
          />
          <p className="large">
            Boost your Python and Machine Learning algorithms
          </p>
          <p>
            Shailen is an AI specialist at Intel. He is the link between the
            core software engineering team and Intel's end-customers. In his
            role, Shailen assists and trains customers on adopting the latest
            and greatest optimized machine-learning and deep-learning frameworks
            in their software development process. Shailen holds a Master’s
            degree in Computational Science and Engineering from the Technical
            University of Munich.
          </p>
          <p>Shailen plays the piano and is an avid football player.</p>
        </article>

        <hr />

        <section className="cards accent-right">
          <aside>
            <h3>Sessions at the same time</h3>
            <ul className="unstyled-list">
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
            </ul>
          </aside>
          <aside>
            <h3>After this session</h3>
            <ul className="unstyled-list">
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
            </ul>
          </aside>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  return { paths: [{ params: { slug: "example" } }], fallback: false };
}

export async function getStaticProps() {
  return {
    props: {
      path: "/talks/example",
    },
  };
}
