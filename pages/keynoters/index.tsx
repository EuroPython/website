import { Layout } from "../../components/layout";
import { Keynote } from "../../components/keynoters";
import keynoters from "../../data/keynoters.json";

export default function IndexPage() {
  return (
    <Layout>
      <main id="main-content">
        <h2 className="h3">Keynote speakers</h2>
        <ul className="speakers-list speakers-list-standalone">
          {keynoters.map((speaker, index) => (
            <Keynote
              key={index}
              name={speaker.name}
              tagline={speaker.tagline}
              link={speaker.link}
              picture={speaker.picture}
              placeholder={speaker.placeholder}
            />
          ))}
        </ul>
      </main>
    </Layout>
  );
}
