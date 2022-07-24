import Image from "next/image";
import { Map } from "./map";
import { ButtonWithTitle } from "./button-with-title";
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
