/**
 * Generate OG image PNGs (1200×630) for all 12 winning bingo combinations.
 * Runs after `astro build`. Saves to `public/bingo-cards/{code}.png`
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import sharp from "sharp";

const OUT_DIR = join(import.meta.dirname, "..", "public", "bingo-cards");

const BINGO_LINES = [
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

const EDITIONS = [
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

const W = 1200;
const H = 630;

// Card section — right side
const CARD_LEFT = 660;
const CARD_TOP = 40;
const CELL = 88;
const GAP = 5;
const PAD = 16;
const COLS = 5;

const cardGridW = COLS * CELL + (COLS - 1) * GAP;
const cardGridH = COLS * CELL + (COLS - 1) * GAP;
const cardW = cardGridW + PAD * 2;
const cardH = cardGridH + PAD * 2;
const cardX = CARD_LEFT;
const cardY = CARD_TOP;

function generateSvg(line) {
  const winSet = new Set(line.cells);
  let cells = "";

  // Card background
  cells += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="6" fill="#0d1520" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;

  // Grid cells
  EDITIONS.forEach((ed, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = cardX + PAD + col * (CELL + GAP);
    const y = cardY + PAD + row * (CELL + GAP);
    const win = winSet.has(i);
    cells += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="4" fill="${win ? "#f0c040" : "#0d1520"}" stroke="${win ? "#d4a830" : "rgba(255,255,255,0.12)"}" stroke-width="${win ? 2 : 1}" stroke-dasharray="${win ? "0" : "4,4"}"/>`;
    cells += `<text x="${x + CELL / 2}" y="${y + CELL * 0.34}" font-family="system-ui,sans-serif" font-size="20" font-weight="800" fill="${win ? "#0b1121" : "#ffffff"}" text-anchor="middle">${ed.year}</text>`;
    cells += `<text x="${x + CELL / 2}" y="${y + CELL * 0.56}" font-family="system-ui,sans-serif" font-size="10" fill="${win ? "rgba(11,17,33,0.65)" : "rgba(255,255,255,0.4)"}" text-anchor="middle">${ed.city}</text>`;
  });

  // Left side text
  const LX = 52;
  let text = "";

  // Title
  text += `<text x="${LX}" y="130" font-family="system-ui,sans-serif" font-size="48" font-weight="800" fill="#f0c040" letter-spacing="-1.5">EUROPYTHON</text>`;
  text += `<text x="${LX}" y="190" font-family="system-ui,sans-serif" font-size="48" font-weight="800" fill="#f0c040" letter-spacing="-1.5">BINGO</text>`;

  // Line completed
  text += `<text x="${LX}" y="260" font-family="system-ui,sans-serif" font-size="26" font-weight="700" fill="#ffffff">I completed ${line.label}!</text>`;

  // Subtitle
  text += `<text x="${LX}" y="305" font-family="system-ui,sans-serif" font-size="17" fill="rgba(255,255,255,0.5)">25 editions · 13 cities · One community</text>`;

  // Status line
  const count = line.cells.length;
  text += `<text x="${LX}" y="345" font-family="system-ui,sans-serif" font-size="15" fill="rgba(255,255,255,0.35)">${count} of 25 editions in this line</text>`;

  // URL at bottom
  text += `<text x="${LX}" y="570" font-family="system-ui,sans-serif" font-size="15" fill="rgba(255,255,255,0.25)">ep2026.europython.eu/bingo/${line.code}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#0b1121"/>
    ${text}
    ${cells}
  </svg>`;

  return svg;
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function generatePng(line) {
  const svg = generateSvg(line);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(OUT_DIR, `${line.code}.png`), png);
  return `Generated ${line.code}.png (${(png.length / 1024).toFixed(0)} KB)`;
}

const results = await Promise.all(BINGO_LINES.map(generatePng));
results.forEach((r) => console.log(r));
console.log(`\nDone. ${BINGO_LINES.length} PNGs in public/bingo-cards/`);
