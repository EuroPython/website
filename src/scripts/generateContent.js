// src/scripts/generateContent.js
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const ROOT_DIR = path.resolve(process.cwd());

function writeJson(data, outputDir, filename) {
  fs.mkdirSync(outputDir, { recursive: true });

  const filepath = path.join(outputDir, filename);

  // Write the file
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

function writeMdx(data, outputDir, contentKey) {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  fs.mkdirSync(outputDir, { recursive: true });

  for (const [key, value] of Object.entries(data)) {
    const filename = `${key}.mdx`;
    const filepath = path.join(outputDir, filename);

    const content = value[contentKey] || "";
    const valueCopy = { ...value };
    delete valueCopy[contentKey];

    const processedContent = content.replace(/<3/g, "❤️");

    const frontmatter = yaml.dump(valueCopy, { sortKeys: true });

    fs.writeFileSync(
      filepath,
      `---\n${frontmatter}---\n\n${processedContent}`,
      "utf-8"
    );
  }
}

function loadJsonData(filename, directory = "src/data") {
  const filePath = path.join(directory, `${filename}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filename}.json not found in ${directory}`);
  }

  console.log(`Load ${filename}.json from ${directory}`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function generateContent() {
  const files = ["speakers", "sessions", "schedule"];

  // Check if any required files are missing
  if (
    files.some((file) => !fs.existsSync(path.join("src/data", `${file}.json`)))
  ) {
    console.log("Nothing to generate. Missing data.");
    return;
  }

  // Load data
  const speakers = loadJsonData("speakers");
  const sessions = loadJsonData("sessions");
  const schedule = loadJsonData("schedule");

  // Process sessions to include speaker slugs
  for (const session of Object.values(sessions)) {
    session.speakers = (session.speakers || [])
      .map((speakerId) => speakers[speakerId]?.slug)
      .filter(Boolean);
  }

  // Process speakers to include submission slugs
  for (const speaker of Object.values(speakers)) {
    speaker.submissions = (speaker.submissions || [])
      .filter((sessionId) => sessionId in sessions)
      .map((sessionId) => sessions[sessionId].slug);
  }

  // Write MDX files
  //writeMdx(sessions, path.join(ROOT_DIR, "src/content/sessions"), "abstract");
  //writeMdx(speakers, path.join(ROOT_DIR, "src/content/speakers"), "biography");

  // Write sessions and speakers JSON files
  writeJson(
    Object.values(sessions),
    path.join(ROOT_DIR, "src/content/sessions"),
    "data.json"
  );
  writeJson(
    Object.values(speakers),
    path.join(ROOT_DIR, "src/content/speakers"),
    "data.json"
  );

  // Write schedule data
  for (const [day, data] of Object.entries(schedule.days || {})) {
    const dayPath = path.join(ROOT_DIR, `src/content/days/${day}.json`);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(dayPath), { recursive: true });

    // Write the file
    fs.writeFileSync(dayPath, JSON.stringify(data, null, 2), "utf-8");
  }
}

// Run the script
generateContent();
