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
  <li className="max-w-md list-none rounded-2xl overflow-clip flex group">
    <a href={link} className="block w-full h-full relative">
      <div className="relative aspect-[9/12] overflow-clip">
        <img
          src={picture}
          alt={`A photo of ${name}`}
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="px-5 py-2 pb-4 bg-keynoter-info rounded-t-none h-full group-hover:opacity-90">
        {placeholder ? (
          <p className="text-body-inverted font-bold">
            More keynoters coming soon
          </p>
        ) : (
          <>
            <p className="text-body-inverted font-bold">{name}</p>
            {tagline ? (
              <p className="text-body-light font-bold text-sm italic">
                {tagline}
              </p>
            ) : null}
          </>
        )}
      </div>
    </a>
  </li>
);
