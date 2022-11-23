import { ButtonLink } from "components/button-link";
import { Map } from "components/map";

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
        <img src="/img/venue.png" className="absolute left-24 top-12 w-7/12" alt="" />
        <img src="/img/burst.png" className="absolute -left-1/2" alt="" />
        <img src="/img/photo.png" className="absolute top-1/2 w-3/4 right-0 translate-y-16" alt="" />
        <img src="/img/map.png" className="absolute top-1/2 w-5/12" alt="" />
      </div>
      <div>
        <h2 className="mt-12 mb-8 font-bold text-5xl">{title}</h2>

        {/* TODO; move prose to a new component */}

        <div className="mb-4 prose-lg prose-li:m-0 prose-ul:m-0 prose-ul:mb-4 prose-li:list-disc">
          {children}
        </div>

        <ButtonLink href="/venue">Read more</ButtonLink>

        <Map />
      </div>
    </article>
  );
};
