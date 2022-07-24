import Link from "next/link";

export const Keynoter = ({
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
