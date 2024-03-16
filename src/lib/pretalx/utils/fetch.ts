export const fetchWithToken: typeof fetch = async (url, options) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${process.env.PRETALX_TOKEN}`,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch: " + response.status);
  }

  return response;
};
