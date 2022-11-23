import Image from "next/image";

type CardProps = {
  title: string;
  subtitle: string;
  content: string;
  url: string;
  image: string;
};

export const Card = ({ title, subtitle, content, url, image }: CardProps) => (
  <a href={url} className="block w-64">
    <div className="relative">
      <Image
        src={image}
        width={600}
        height={375}
        alt=""
        className="rounded-2xl"
      />
    </div>
    <h3 className="text-3xl font-bold mt-6 mb-4">{title}</h3>
    <p className="bg-primary inline-block text-black font-extrabold px-1 text-lg mb-4">
      {subtitle}
    </p>
    <p className="text-lg">{content}</p>
  </a>
);
