type MapProps = {
  src: string;
  title?: string;
};

export const Map = ({ src, title = "Map" }: MapProps) => (
  <iframe
    src={src}
    title={title}
    className="w-full aspect-video max-w-[800px] border-4 border-white rounded-lg shadow-lg"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
);
