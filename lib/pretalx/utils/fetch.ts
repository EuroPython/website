export const fetchWithToken: typeof fetch = async (url, options) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${process.env.PRETALX_TOKEN}`,
      "User-Agent": "europython.io",
    },
    next: {
      ...(options?.next || {}),
    },
  });

  if (!response.ok) {
    console.log(response.status, response.statusText);
    console.log(await response.text());
    throw new Error("Failed to fetch sessions");
  }

  return response;
};
