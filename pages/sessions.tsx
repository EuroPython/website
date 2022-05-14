import scheduleData from "../data/schedule.json";
import { Layout } from "../components/layout";

export default function SessionsPage({
  sessions,
}: {
  sessions: { title: string; speaker: string; slug: string }[];
}) {
  return (
    <Layout>
      <main id="main-content">
        <h1>Sessions list</h1>
        {sessions.map(({ title, speaker, slug }) => (
          <div key={slug}>
            <h2>
              <a href={`/talks/${slug}`}>{title}</a>
            </h2>
            <p>{speaker}</p>

            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Repellendus quo nemo, vero exercitationem numquam quod ab labore
              quasi possimus neque porro vitae. Saepe cumque, maxime
              necessitatibus quas aut blanditiis quidem?
            </p>

            <p>
              <span className="tag">Analytics</span>
              <span className="tag">Data Science</span>
              <span className="tag">Machine Learning</span>
              <span className="tag">Performance</span>
              <span className="tag">Scientific Libraries</span>
            </p>
          </div>
        ))}
      </main>
    </Layout>
  );
}

const getAllTalks = () => {
  return Object.values(scheduleData.days)
    .flatMap((day) => day.talks)
    .filter((talk) => !!talk.slug);
};

export async function getStaticProps() {
  const allTalks = getAllTalks();

  return {
    props: {
      sessions: allTalks,
    },
  };
}
