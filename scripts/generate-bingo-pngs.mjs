/**
 * Generate PNG images for bingo winning combinations during build.
 * Runs as part of the build process, after `astro build`.
 * Saves to `public/bingo-cards/{code}.png`
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));

const lines = [
  { code: "329K", label: "Row 1", cells: [0, 1, 2, 3, 4] },
  { code: "7XX6", label: "Row 2", cells: [5, 6, 7, 8, 9] },
  { code: "JYUW", label: "Row 3", cells: [10, 11, 12, 13, 14] },
  { code: "5G5U", label: "Row 4", cells: [15, 16, 17, 18, 19] },
  { code: "99SR", label: "Row 5", cells: [20, 21, 22, 23, 24] },
  { code: "PFKN", label: "Col 1", cells: [0, 5, 10, 15, 20] },
  { code: "HFVK", label: "Col 2", cells: [1, 6, 11, 16, 21] },
  { code: "JPYK", label: "Col 3", cells: [2, 7, 12, 17, 22] },
  { code: "W3V8", label: "Col 4", cells: [3, 8, 13, 18, 23] },
  { code: "6HKX", label: "Col 5", cells: [4, 9, 14, 19, 24] },
  { code: "VMHN", label: "Diagonal ↘", cells: [0, 6, 12, 18, 24] },
  { code: "47YA", label: "Diagonal ↗", cells: [4, 8, 12, 16, 20] },
];

const editions = [
  { year: 2002, city: "Charleroi" },
  { year: 2003, city: "Charleroi" },
  { year: 2004, city: "Gothenburg" },
  { year: 2005, city: "Gothenburg" },
  { year: 2006, city: "CERN, Geneva" },
  { year: 2007, city: "Vilnius" },
  { year: 2008, city: "Vilnius" },
  { year: 2009, city: "Birmingham" },
  { year: 2010, city: "Birmingham" },
  { year: 2011, city: "Florence" },
  { year: 2012, city: "Florence" },
  { year: 2013, city: "Florence" },
  { year: 2014, city: "Berlin" },
  { year: 2015, city: "Bilbao" },
  { year: 2016, city: "Bilbao" },
  { year: 2017, city: "Rimini" },
  { year: 2018, city: "Edinburgh" },
  { year: 2019, city: "Basel" },
  { year: 2020, city: "Online" },
  { year: 2021, city: "Online" },
  { year: 2022, city: "Dublin" },
  { year: 2023, city: "Prague" },
  { year: 2024, city: "Prague" },
  { year: 2025, city: "Prague" },
  { year: 2026, city: "Kraków" },
];

const CELL = 140;
const GAP = 6;
const PAD = 32;
const HEADER = 70;
const FOOTER = 40;
const COLS = 5;
const ROWS = 5;
const W = COLS * CELL + (COLS - 1) * GAP + PAD * 2;
const H = HEADER + ROWS * CELL + (ROWS - 1) * GAP + FOOTER + PAD * 2;

const outDir = join(dirname(__dirname), "public", "bingo-cards");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Generate SVG, then convert to PNG via sharp
async function generatePng(line) {
  const winSet = new Set(line.cells);
  let cells = "";
  editions.forEach((ed, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CELL + GAP);
    const y = HEADER + row * (CELL + GAP);
    const win = winSet.has(i);
    const rx = x;
    const ry = y;
    cells += `<rect x="${rx}" y="${ry}" width="${CELL}" height="${CELL}" rx="4" fill="${win ? "#f0c040" : "#0d1520"}" stroke="${win ? "#d4a830" : "rgba(255,255,255,0.12)"}" stroke-width="${win ? 2 : 1}" stroke-dasharray="${win ? "0" : "4,4"}"/>`;
    cells += `<text x="${rx + CELL / 2}" y="${ry + CELL * 0.38}" font-family="system-ui,sans-serif" font-size="28" font-weight="800" fill="${win ? "#0b1121" : "#ffffff"}" text-anchor="middle">${ed.year}</text>`;
    cells += `<text x="${rx + CELL / 2}" y="${ry + CELL * 0.62}" font-family="system-ui,sans-serif" font-size="14" fill="${win ? "rgba(11,17,33,0.65)" : "rgba(255,255,255,0.4)"}" text-anchor="middle">${ed.city}</text>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#0b1121" rx="6"/>
    <text x="${W / 2}" y="46" font-family="system-ui,sans-serif" font-size="26" font-weight="800" fill="#f0c040" text-anchor="middle" letter-spacing="-0.5">EuroPython Bingo</text>
    <text x="${W / 2}" y="${H - 14}" font-family="system-ui,sans-serif" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle">ep2026.europython.eu/bingo/${line.code}</text>
    ${cells}
  </svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(outDir, `${line.code}.png`), png);
  return `Generated ${line.code}.png (${(png.length / 1024).toFixed(0)} KB)`;
}

const results = await Promise.all(lines.map(generatePng));
results.forEach((r) => console.log(r));
console.log(`\nDone. ${lines.length} PNGs in public/bingo-cards/`);
