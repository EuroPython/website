const API_URL = "https://programapi.europython.eu/speakers.json";

export const fetchSpeakers = async () => {
  const response = await fetch(API_URL);

  return await response.json();
};
