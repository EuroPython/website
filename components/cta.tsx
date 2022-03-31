type Props = {
  title: string;
  href: string;
  text: string;
};

export const ButtonWithTitle = ({ title, href, text }: Props) => {
  return (
    <div className="cta cta--centered">
      <h3 className="h4 highlighted">{title}</h3>
      <a className="button" href={href}>
        {text}
      </a>
    </div>
  );
};
