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
  <li className="max-w-md list-none">
    <Link href={link} className="block w-full h-full relative">
      <img src={picture} className="rounded-2xl w-full h-full object-cover" />

      <div className="absolute bottom-0 left-0 right-0 px-5 pt-2 pb-8 bg-keynoter-info rounded-2xl rounded-t-none">
        {placeholder ? (
          <p className="text-body-inverted font-bold">
            More keynoters coming soon
          </p>
        ) : (
          <>
            <p className="text-body-inverted font-bold">{name}</p>
            {tagline ? (
              <p className="text-body-light font-bold">{tagline}</p>
            ) : null}
          </>
        )}
      </div>
    </Link>
  </li>
);
