import { ButtonLink } from "../button-link";
import { Link } from "../link/link";
import { Prose } from "../prose/prose";
import { Title } from "../typography/title";

export const HeroVenue = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <article className="lg:grid gap-12 grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="/img/venue-hero.jpg"
          className="w-full h-auto"
          alt=""
          width={1200}
          height={900}
        />
      </div>
      <div className="flex flex-col justify-center">
        <Title level={2}>{title}</Title>

        <Prose>{children}</Prose>

        <div className="space-x-4" style={{ marginBottom: 10 }}>
          <ButtonLink href="/where#prague-congress-centre---conference-venue">
            PCC Conference Venue
          </ButtonLink>

          <Link href="https://www.google.com/maps?ll=50.062576,14.429021&z=14&t=m&mapclient=embed&cid=5559277398893748727">
            Get directions to the PCC
          </Link>
        </div>

      </div>
    </article>
  );
};
