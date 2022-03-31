import Image from "next/image";
import { Map } from "../components/map";
import { ButtonWithTitle } from "../components/cta";
import { SponsorTiers } from "./sponsor-tiers";
import { BenefitItem, BenefitsList } from "./benefits-list";
import { ButtonLink } from "./button-link";
import { Note } from "./note";

export const components = {
  Map,
  ButtonWithTitle,
  SponsorTiers,
  BenefitItem,
  BenefitsList,
  ButtonLink,
  Note,

  img: ({ src, alt, ...props }: any) => (
    <figure className="next-image">
      <Image src={src} alt={alt} {...props} layout="fill" objectFit="contain" />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  ),
};
