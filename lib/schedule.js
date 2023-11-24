// this is in javascript because it is used by next.config.js
// @ts-check
const data = require("./schedule_data.json");

// data was coming from https://programapi.europython.eu/schedule.json

const fetchSchedule = async () => {
  return data;
};

module.exports = {
  fetchSchedule,
};
