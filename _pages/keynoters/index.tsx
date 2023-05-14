import { Layout } from "../../components/layout";
import { Keynoter } from "../../components/keynoters/keynoter";
import keynoters from "../../data/keynoters.json";
import { Title } from "components/typography/title";

export default function IndexPage() {
  return (
    <Layout path="keynoters" title="Keynoters || EuroPython 2022">
      <main id="main-content" className="px-6">
        <Title>Keynote speakers</Title>

        <ul className="grid sm:grid-cols-2 gap-12">
          {keynoters.map((speaker, index) => (
            <Keynoter
              key={index}
              name={speaker.name}
              tagline={speaker.tagline}
              link={speaker.link}
              picture={speaker.picture}
              placeholder={false}
            />
          ))}
        </ul>
      </main>
    </Layout>
  );
}
