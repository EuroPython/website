import keynoters from "../data/keynoters.json";

export const Keynote = ({
  name,
  tagline,
  picture,
  placeholder,
}: {
  placeholder?: boolean;
  name?: string;
  tagline?: string;
  picture: string;
}) => (
  <li className={placeholder ? "placeholder" : ""}>
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
  </li>
);

export const Keynoters = () => {
  return (
    <article className="speakers-list__container">
      <h2 className="h3">Keynote speakers</h2>
      <ul className="speakers-list">
        {keynoters.map((speaker, index) => (
          <Keynote
            key={index}
            name={speaker.name}
            tagline={speaker.tagline}
            picture={speaker.picture}
            placeholder={speaker.placeholder}
          />
        ))}
      </ul>

      <div className="speakers-list__cta">
        <h3 className="h4 highlighted">See all speakers</h3>
        <a className="button" href="#">
          Coming soon
        </a>
      </div>
    </article>
  );
};
