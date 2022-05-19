import type { NextApiRequest, NextApiResponse } from "next";

import sessions from "../../data/sessions/list.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { session } = req.query;

  let imageUrl = "https://ep2022.europython.eu/social-cards/default.png";
  const api = "https://i.microlink.io/";
  const cardsUrl = new URL("https://cards.microlink.io/");

  const params: any = {
    preset: "adobe",
    p: "DwPgUABBwDIJYDsDWkoQBYCcCmAzAvAOToAuJADgM4BcA9LQMYAmCAdAO4D2mSnlrDTgFta7MbU7lsCALQBzTAENy6WkMWIBlSoVRQcAGyKUSATwPZK6bNhK6otcFGAAxCwA8naYAEl1c7AhKTAZ8ACJSChp6bHIAJgAGOLjWbABXTElTEnRONnTaSk4GOEUDGQZFTCZKWgAjRUpsVnIEOTCg93wAb269NHY4JhzqCDCARgSEgFIwgBp%2BqGs4OVJRianZhbQIAF9diEcwftcPTp6%2BnahyPjgSODz1xTqigzSSbHmIRYgALx8EExsO5RpM5t8rhBBAZuOt2Og7p9tld6BAGgwkApOGlAescEx5j8LLgSKCpsidpgVmsIJMEhS0HVOGRhKN6T8SJJRnEAKzsyEfdwkACCBhWCHWDGkH0whMhuDyJBciiEcAMplGhBkynIFhklFMJmwQnBYQNRqEMjScC%2BYQAytg5JxAgBVHxfABKnCZnPBAAlsAYAG62OCVcHCqllcGURQISj67BU3Cm4XkXWBADCnBhmAgAFEhJwAFY200Op2unwFoul20V50QN0QO2mIRMgxhQgMqC4DwAETgOAY90eY2haSECDlaH2Xh2wAAKsCSOdej9e4qAOrYamksYdgk9tAKhAkO1wX7YUY849QQUkRdKeMKzBCdZpdNJypNMI-OfdAAjmkSamKw9wkBYuzALQy5CvO3hwaulBdOukKbmeF5Xje-67CAQEgZgYGUGkdQQVBMFIQhMFuMCXg0R44AwSAQA",
  };

  if (session) {
    const sessionData = sessions.find((s) => s.code === session);

    if (sessionData) {
      params.title = sessionData.title;
      params.subtitle = sessionData.speakers.map((s) => s.name).join(", ");

      Object.entries(params).forEach(([key, value]) => {
        cardsUrl.searchParams.append(key, value as string);
      });

      imageUrl = `${api}${encodeURIComponent(cardsUrl.href)}`;
    }
  }

  res.writeHead(308, { Location: imageUrl });
  res.end();
};
