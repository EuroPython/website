import Image from "next/image";
import { Map } from "./map";
import { ButtonWithTitle } from "./button-with-title";
import { SponsorTiers } from "./sponsor-tiers";
import { BenefitItem, BenefitsList } from "./benefits-list";
import { ButtonLink } from "./button-link";
import { Note } from "./note";
import clsx from "clsx";
import { Separator } from "./separator/separator";
import { Title } from "./typography/title";

export const components = {
  h1: ({ children, className, ...props }: any) => {
    return (
      <Title level={1} {...props}>
        {children}
      </Title>
    );
  },
  h2: ({ children, className, ...props }: any) => {
    return (
      <Title level={2} {...props}>
        {children}
      </Title>
    );
  },
  h3: ({ children, className, ...props }: any) => {
    return (
      <Title level={3} {...props}>
        {children}
      </Title>
    );
  },
  h4: ({ children, className, ...props }: any) => {
    return (
      <Title level={4} {...props}>
        {children}
      </Title>
    );
  },
  h5: ({ children, className, ...props }: any) => {
    return (
      <Title level={5} {...props}>
        {children}
      </Title>
    );
  },
  h6: ({ children, className, ...props }: any) => {
    return (
      <Title level={6} {...props}>
        {children}
      </Title>
    );
  },
  p: ({ children }: any) => (
    <p className="mb-4 text-xl leading-snug">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="mb-4 list-disc pl-4">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="mb-4 list-decimal pl-4">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="mb-2 text-xl leading-snug">{children}</li>
  ),
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

    let Component: string | typeof Image = Image;

    if (!props.width && !props.height) {
      Component = "img";
    }

    return (
      <figure className="next-image relative">
        <Component src={src} alt={alt} {...props} />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    );
  },
};
