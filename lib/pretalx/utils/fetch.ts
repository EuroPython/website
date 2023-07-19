export const fetchWithToken: typeof fetch = async (url, options) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${process.env.PRETALX_TOKEN}`,
      "User-Agent": "europython.io3",
    },
    next: {
      ...(options?.next || {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch: " + response.status);
  }

  return response;
};
