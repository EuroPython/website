import Link from "next/link";
import keynoters from "../../data/keynoters.json";
import { Keynoter } from "./keynoter";

export const Keynoters = () => {
  return (
    <article className="speakers-list__container">
      <h2 className="h3">
        <Link href={"/keynoters"}>
          <a>Keynote speakers</a>
        </Link>
      </h2>
      <ul className="speakers-list">
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

      <div className="speakers-list__cta">
        <h3 className="h4 highlighted">See all sessions</h3>
        <a className="button" href="/sessions">
          Sessions
        </a>
      </div>
    </article>
  );
};
