import type { NextApiRequest, NextApiResponse } from "next";

import sessions from "../../data/sessions/list.json";
import keynoters from "../../data/keynoters.json";

const getParamsForSession = (session: {
  title: string;
  speakers: { name: string }[];
}) => {
  return {
    preset: "adobe",
    p: "DwPgUABBwDIJYDsDWkoQBYCcCmAzAvAOToAuJADgM4BcA9LQMYAmCAdAO4D2mSnlrDTgFta7MbU7lsCALQBzTAENy6WkMWIBlSoVRQcAGyKUSATwPZK6bNhK6otcFGAAxCwA8naYAEl1c7AhKTAZ8ACJSChp6bHIAJgAGOLjWbABXTElTEnRONnTaSk4GOEUDGQZFTCZKWgAjOVZyBDkwoPd8AG9OvTR2OCYc6ggwgEYEhIBSMIAaXqhrODlSYbGJ6bm0CABfbYhHMF7XD3aunq2ocj44Ejg81cU6ooM0kmxZiHmIAC8fBCZsO5huMZp8LhBBAZuKt2Ogbu9Nhd6BA6ooGEgFJw0v9VjgmLMvhZcCRhglEVtMEsVhAyV86pwyMJSeS0CRJMyvm93CQAIIGJYIVYMaRvTAE8G4PIkFyKIRwAymYaEGTKcgWGSUUwmbBCUFhTXaoQyNJwD5hADK2DknECAFUfB8AEqcels0EACWwBgAbrY4JVQTzKWVQZRFAhKBrsJTcHqeeQ1YEAMKcKGYCAAUSEnAAVqa9ZbrXafJns3mzYWbRB7RBzaYhPSDGFCCyoLgPAAROA4Bi3e4jSFpIQIcUXHNpExwXCmFMIN5zoUi6OjrZlAU%2BN5CGgDpdi3q7LxbXz%2BQLBUIRMhUOi0WKJZKpDJZHJ5B%2BFYqlcqVaq1NnkJotNpKA6bovigfpBnQVYAHYphXC4G2oAAWL5dn2Q9oDcQFTm6dtAS7Hs%2B0FAdUyHEcZgPL5gAAFUBEhsPOcEIElOcAHVsCpEkRkbfFWzQZiSHNOBvmwYYAFZeKgLkSCopQI0lTAhFWNIE2jSpKHeFDthAToAEc0mjUxWFuEgLG2YBaBo7l0OcSy6KAs5QKYqVBOEsTNO0vSDNYSg0jqYzTPM2zrOgWhMM8I5Qo8LxzLC8BzJAIA",
    title: session.title,
    subtitle: session.speakers.map((s) => s.name).join(", "),
  };
};

const getParamsForKeynoter = (keynoter: {
  name: string;
  tagline: string;
  picture: string;
}) => {
  return {
    preset: "adobe",
    p: "DwPgUABBwDIJYDsDWkoQBYCcCmAzAvAOToAuJADgM4BcA9LbgPYImUB0A5o4xwDbYBDcnHYBjRgFtaoypQBMAflwCJcXgE98AIRzYA1AGVsmOLgBkAExHleAzQCNejUUkKooOXkUol1-SujY2CRuULTgqMAAYvwAHuBo0ACSEgIc2O5olJii%2BABEpBQ09NjkcgAMcnJs2ACumIzk6iTozDW1tJTOcAK8ALSiApgWlLT2HGzkCBx5mVCUsfgA3ktzaADucBYt1BB5AIzl5QCkeQA0a1CBcBykuwdHpxeJUAC%2Br5nhYJnRcWsLy1WLzQ5EYlDgJDgzHuAnsXV4tRI2HOlwgAC8kggLNhYrtDs9gRBxE5MPd1ugIciCcD6BB7AIXBwGrUsfccBYUYSIPxcCRduVqS8TLc%2BRABaj7IwyJJ%2BYLEiRGrLUUjYiQAIK8G4Ie6ibAsYycwlMFhRFRqdTUVFQQh9IQ2bB9SjqHzYCRnPZOl0SPq1ODnPZGLjYCAAVSS-oASoxJQr3QAJbC8ABuwTgg3dapMvXdlAECEojuMpndeTV5HtEAAwowSRAAKISRgAKz9JcDjGDYfrjZb-ry7c7SQgBnUEklvDyhDlaFwcQAInAcKJIdC9sTahIEIbgU3aj5TOpq-qWDq9UjMNuXr0tUkkRIaGuzwbp%2B9MgkXsAUmkMlzsrkCmQVB0LQpQVFU7QNE0LRtHUnTdL0AxDCMtAKuQkzTLMv6LCsVoQJs2zoPcADsJyXsCY67AALNObwfDS76JL8OIQACKwQLOOILkuK7ansDTrP65C4hAACsEDvAxH5fukuGsUseFbDsEAVAKEASKS1FXNgNx3HsAiIow-qSsMxj3CJQksTWWwQAAxJRcj2JUACceTiXRXIsTkywAI61MY6hsHAqTpO59GokxsQsdh8kcbEXHYMuUK8Xk66bnkEm4cAAAqOIkFFgK4VAxKMKSew2dgFgAByOeUZFGswJAAOraSK9zjhyNEvMaJAGHAaLYLsABsnXyrlWWYHmlBMJgEj3LU5bGIMlBUrhEkALJBHlSDYOoCBSsYwC0DlqqScC2W5YV%2BU4R5LzFaVeR2Q5zl1Vy3W9f1Q0jV1DWmqoGj3DoQTDkWuAvS8r43adhJLL5-lsAgKjYKFhKHcdJBQ4xaOXXJl1QG9fUDaJX2JN1v3mgDujAyYoPE25uEYy8MN%2BZgAWULU9iQiQ-DI2dR25Qzh0xDiUOC3Ekmi8LkS0EL8RgIdIBAA",
    name: keynoter.name,
    image: `https://ep2022.europython.eu/${keynoter.picture}`,
    subtitle: keynoter.tagline,
  };
};

const getParams = async (req: NextApiRequest) => {
  const { session, keynoter } = req.query;

  if (session) {
    const sessionData = sessions.find((s) => s.code === session);

    if (sessionData) {
      return getParamsForSession(sessionData);
    }
  }

  if (keynoter) {
    const keynoterData = keynoters.find((k) =>
      k.link.endsWith(keynoter as string)
    );

    if (keynoterData) {
      return getParamsForKeynoter({
        name: keynoterData.name as string,
        tagline: keynoterData.tagline as string,
        picture: keynoterData.picture,
      });
    }
  }

  return null;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let imageUrl = "https://ep2022.europython.eu/social-cards/default.png";
  const api = "https://i.microlink.io/";
  const cardsUrl = new URL("https://cards.microlink.io/");

  const params = await getParams(req);

  if (params !== null) {
    Object.entries(params).forEach(([key, value]) => {
      cardsUrl.searchParams.append(key, value as string);
    });

    imageUrl = `${api}${encodeURIComponent(cardsUrl.href)}`;
  }

  res.writeHead(308, { Location: imageUrl });
  res.end();
};
