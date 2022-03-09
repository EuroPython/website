type CardProps = {
  title: string;
  subtitle: string;
  content: string;
};

export const Card = ({ title, subtitle, content }: CardProps) => (
  <aside>
    <img src="/img/photo.png" alt="" />
    <h3>{title}</h3>
    <p className="card__subheading">{subtitle}</p>
    <p>{content}</p>
  </aside>
);
