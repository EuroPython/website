// src/scripts/fetchEuroPythonData.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//const API_URL = "https://programapi.europython.eu/ep2025";

const API_URL = "https://programapi24.europython.eu/2024";

// URLs for EuroPython 2025 data
const SESSIONS_URL =
  "https://gist.githubusercontent.com/egeakman/eddfb15f32ae805e8cfb4c5856ae304b/raw/466f8c20c17a9f6c5875f973acaec60e4e4d0fae/sessions.json";
const SPEAKERS_URL =
  "https://gist.githubusercontent.com/egeakman/469f9abb23a787df16d8787f438dfdb6/raw/62d2b7e77c1b078a0e27578c72598a505f9fafbf/speakers.json";
const SCHEDULE_URL =
  "https://gist.githubusercontent.com/nikoshell/55ab27b228a31130134f689429e93bf5/raw/a1542efb298366645ad44ae9087772671646d51b/schedule.json";

// Define output directory and file paths
const DATA_DIR = path.join(__dirname, "../data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const SPEAKERS_FILE = path.join(DATA_DIR, "speakers.json");
const SCHEDULE_FILE = path.join(DATA_DIR, "schedule.json");

// Ensure data directory exists
fs.mkdirSync(DATA_DIR, { recursive: true });

// Function to fetch and save data
async function fetchAndSaveData(url, filePath) {
  console.log(`Fetching data from ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully saved data to ${filePath}`);
    return data;
  } catch (error) {
    console.error(`Error fetching or saving data from ${url}:`, error);
    throw error;
  }
}

// Main function to fetch all data
async function fetchAllData() {
  try {
    // Fetch and save all three data files
    const sessions = await fetchAndSaveData(SESSIONS_URL, SESSIONS_FILE);
    console.log(`Fetched ${Object.keys(sessions).length} sessions`);

    const speakers = await fetchAndSaveData(SPEAKERS_URL, SPEAKERS_FILE);
    console.log(`Fetched ${Object.keys(speakers).length} speakers`);

    const schedule = await fetchAndSaveData(SCHEDULE_URL, SCHEDULE_FILE);
    console.log(`Fetched schedule data`);

    console.log("All data fetched and saved successfully!");
  } catch (error) {
    console.error("Failed to fetch all data:", error);
    process.exit(1);
  }
}

// Execute the data fetching
fetchAllData();
