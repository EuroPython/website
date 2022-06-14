// this is in javascript because it is used by next.config.js
// @ts-check
const API_URL = "https://programapi.europython.eu/schedule.json";

const fetchSchedule = async () => {
  const response = await fetch(API_URL);

  return await response.json();
};

module.exports = {
  fetchSchedule,
};
