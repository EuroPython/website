import { ButtonLink } from "components/button-link";
import { Map } from "components/map";
import { Prose } from "components/prose/prose";

export const HeroVenue = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <article className="lg:grid gap-12 grid-cols-[1fr_40rem]">
      <div className="relative hidden lg:block">
        <img
          src="/img/venue.jpg"
          className="absolute left-24 top-12 w-7/12"
          alt=""
        />
        <img src="/img/burst.png" className="absolute -left-1/2" alt="" />
        <img
          src="/img/photo.png"
          className="absolute top-1/2 w-3/4 translate-y-16"
          alt=""
        />
      </div>
      <div>
        <h2 className="mt-12 mb-8 font-bold text-5xl">{title}</h2>

        <Prose>{children}</Prose>

        <ButtonLink href="/where#prague-congress-centre---conference-venue">Read more</ButtonLink>

        <div className="mt-8">
          <Map />
        </div>
      </div>
    </article>
  );
};
