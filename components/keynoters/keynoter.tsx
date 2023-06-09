import Link from "next/link";
import Image from "next/image";

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
    <Link href={link} className="block w-full h-full relative group rounded-2xl overflow-clip">
      <div className="relative aspect-[9/12]">
        <Image
          src={picture}
          fill
          alt={`A photo of ${name}`}
          className="object-cover "
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pt-2 pb-8 bg-keynoter-info rounded-t-none group-hover:opacity-80">
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
