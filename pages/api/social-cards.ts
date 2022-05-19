import type { NextApiRequest, NextApiResponse } from "next";

import sessions from "../../data/sessions/list.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { session } = req.query;

  let imageUrl = "https://ep2022.europython.eu/social-cards/default.png";
  const api = "https://i.microlink.io/";
  const cardsUrl = new URL("https://cards.microlink.io/");

  const params: any = {
    preset: "adobe",
    p: "DwPgUABBwDIJYDsDWkoQBYCcCmAzAvAOToAuJADgM4BcA9LQMYAmCAdAO4D2mSnlrDTgFta7MbU7lsCALQBzTAENy6WkMWIBlSoVRQcAGyKUSATwPZK6bNhK6otcFGAAxCwA8naYAEl1c7AhKTAZ8ACJSChp6bHIAJgAGOLjWbABXTElTEnRONnTaSk4GOEUDGQZFTCZKWgAjOVZyBDkwoPd8AG9OvTR2OCYc6ggwgEYEhIBSMIAaXqhrODlSYbGJ6bm0CABfbYhHMF7XD3aunq2ocj44Ejg81cU6ooM0kmxZiHmIAC8fBCZsO5huMZp8LhBBAZuKt2Ogbu9Nhd6BA6ooGEgFJw0v9VjgmLMvhZcCRhglEVtMEsVhAyV86pwyMJSeS0CRJMyvm93CQAIIGJYIVYMaRvTAE8G4PIkFyKIRwAymYaEGTKcgWGSUUwmbBCUFhTXaoQyNJwD5hADK2DknECAFUfB8AEqcels0EACWwBgAbrY4JVQTzKWVQZRFAhKBrsJTcHqeeQ1YEAMKcKGYCAAUSEnAAVqa9ZbrXafJns3mzYWbRB7RBzaYhPSDGFCCyoLgPAAROA4Bi3e4jSFpIQIcUXHNpExwXCmFMIN5zoUi6OjrZlAU%2BN5CGgDpdi3q7LxbXz%2BQLBUIRMhUOi0WKJZKpDJZHJ5B%2BFYqlcqVaq1NnkJotNpKA6bovigfpBnQVYAHYphXC4G2oAAWL5dn2Q9oDcQFTm6dtAS7Hs%2B0FAdUyHEcZgPL5gAAFUBEhsPOcEIElOcAHVsCpEkRkbfFWzQZiSHNOBvmwYYAFZeKgLkSCopQI0lTAhFWNIE2jSpKHeFDthAToAEc0mjUxWFuEgLG2YBaBo7l0OcSy6KAs5QKYqVBOEsTNO0vSDNYSg0jqYzTPM2zrOgWhMM8I5Qo8LxzLC8BzJAIA",
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
