const API_URL = "https://programapi.europython.eu/sessions.json";

export const fetchSessions = async () => {
  const response = await fetch(API_URL);

  return await response.json();
};
