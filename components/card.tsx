type CardProps = {
  title: string;
  subtitle: string;
  content: string;
  url: string;
  image: string;
};

export const Card = ({ title, subtitle, content, url, image }: CardProps) => (
  <aside>
    <a href={url}>
      <img src={image} alt="" />
      <h3>{title}</h3>
      <p className="card__subheading">{subtitle}</p>
      <p>{content}</p>
    </a>
  </aside>
);
