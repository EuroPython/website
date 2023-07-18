"use client";

export const YoutubeVideo = ({ youtubeId }: { youtubeId: string }) => {
  return (
    <iframe
      id="ytplayer"
      className="w-full h-full aspect-[16/9]"
      width="640"
      height="360"
      src={`https://www.youtube.com/embed/${youtubeId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
};
