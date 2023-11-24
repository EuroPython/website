import data from "./speakers_data.json";

// data was coming from https://programapi.europython.eu/speakers.json

export const fetchSpeakers = async () => {
  return data;
};
