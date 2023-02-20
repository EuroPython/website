import Image from "next/image";
import { Map } from "./map";
import { ButtonWithTitle } from "./button-with-title";
import { SponsorTiers } from "./sponsor-tiers";
import { BenefitItem, BenefitsList } from "./benefits-list";
import { ButtonLink } from "./button-link";
import { Note } from "./note";
import clsx from "clsx";
import { Separator } from "./separator/separator";

export const components = {
  h1: ({ children, className }: any) => {
    let h = null;

    if (className?.includes("highlighted")) {
      h = (
        <span className="text-7xl font-bold absolute right-full mr-4">#</span>
      );
    }

    return (
      <h1 className="text-7xl font-bold mb-24 relative [&>a]:text-text [&>a]:no-underline">
        {h}
        {children}
      </h1>
    );
  },
  h2: ({ children }: any) => (
    <h2 className="text-5xl leading-tight font-bold mb-4 [&>a]:text-text [&>a]:no-underline">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-3xl font-bold mb-4 [&>a]:text-text [&>a]:no-underline">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-2xl font-bold mb-4 [&>a]:text-text [&>a]:no-underline">
      {children}
    </h4>
  ),
  h5: ({ children }: any) => (
    <h5 className="text-xl font-bold mb-4 [&>a]:text-text [&>a]:no-underline">
      {children}
    </h5>
  ),
  h6: ({ children }: any) => (
    <h6 className="text-lg font-bold mb-4 [&>a]:text-text [&>a]:no-underline">
      {children}
    </h6>
  ),
  p: ({ children }: any) => (
    <p className="mb-4 text-xl leading-snug">{children}</p>
  ),
  ul: ({ children }: any) => <ul className="mb-4 list-disc pl-4">{children}</ul>,
  ol: ({ children }: any) => <ol className="mb-4 list-decimal pl-4">{children}</ol>,
  li: ({ children }: any) => <li className="mb-2 text-xl leading-snug">{children}</li>,
  a: ({ children, href, ...props }: any) => (
    <a
      className="text-primary hover:text-primary-hover underline"
      href={href}
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children }: any) => (
    <strong className="font-bold">{children}</strong>
  ),
  em: ({ children }: any) => <em className="italic">{children}</em>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 mb-4">
      {children}
    </blockquote>
  ),
  hr: Separator,
  article: ({ children, className }: any) => (
    <article className={clsx(className, "mb-24")}>{children}</article>
  ),
  Map,
  ButtonWithTitle,
  SponsorTiers,

  // TODO: these two are not working together
  BenefitItem,
  BenefitsList,
  ButtonLink,
  Note,

  img: ({ src, alt, ...props }: any) => {
    props.objectFit = "contain";

    if (!props.width && !props.height) {
      props.layout = "fill";
      props.objectFit = "contain";
    }
    {
      props.layout = "responsive";
    }

    return (
      <figure className="next-image">
        <Image src={src} alt={alt} {...props} />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    );
  },
};
