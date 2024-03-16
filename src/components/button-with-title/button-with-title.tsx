import { ButtonLink } from "../button-link";
import { Title } from "../typography/title";

type Props = {
  title: string;
  href: string;
  text: string;
};

export const ButtonWithTitle = ({ title, href, text }: Props) => {
  return (
    <div className="flex flex-col items-center">
      <Title highlighted level={3}>
        {title}
      </Title>

      <div>
        <ButtonLink href={href}>{text}</ButtonLink>
      </div>
    </div>
  );
};
