import scheduleData from "../../data/schedule.json";
import { Layout } from "../../components/layout";

export default function Page({
  path,
  talk,
}: {
  path: string;
  talk: {
    title: string;
  };
}) {
  console.log(talk);
  return (
    <Layout path={path}>
      <main id="main-content">
        <article className="accent-left">
          <h1>{talk.title}</h1>
          <p>
            <strong>Talk content</strong>
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

const getAllTalks = () => {
  return (
    Object.values(scheduleData.days)
      .flatMap((day) => day.talks)
      // @ts-ignore
      .filter((talk) => !!talk.slug)
  );
};

export async function getStaticPaths() {
  const allTalks = getAllTalks();

  return {
    paths: allTalks.map((talk) => ({
      params: {
        // @ts-ignore
        slug: talk.slug,
      },
    })),
    fallback: false,
  };

  return { paths: [{ params: { slug: "example" } }], fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const allTalks = getAllTalks();
  // @ts-ignore
  const talk = allTalks.find((talk) => talk.slug === params.slug);

  return {
    props: {
      path: `/talks/${params.slug}`,
      talk,
    },
  };
}
