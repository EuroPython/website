import Link from "next/link";
import keynoters from "../data/keynoters.json";

export const Keynote = ({
  name,
  tagline,
  link,
  picture,
  placeholder,
}: {
  placeholder?: boolean;
  name?: string;
  link: string;
  tagline?: string;
  picture: string;
}) => (
  <li className={placeholder ? "placeholder" : ""}>
    <Link href={link}>
      <a>
        <img src={picture} />
        <div className="speaker-description">
          {placeholder ? (
            <p className="speaker-name">More keynoters coming soon</p>
          ) : (
            <>
              <p className="speaker-name">{name}</p>
              {tagline ? <p>{tagline}</p> : null}
            </>
          )}
        </div>
      </a>
    </Link>
  </li>
);

export const Keynoters = () => {
  return (
    <article className="speakers-list__container">
      <h2 className="h3">
        <Link href={"/keynoters"}>
          <a> Keynote speakers</a>
        </Link>
      </h2>
      <ul className="speakers-list">
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

      <div className="speakers-list__cta">
        <h3 className="h4 highlighted">See all sessions</h3>
        <a className="button" href="/sessions">
          Sessions
        </a>
      </div>
    </article>
  );
};
