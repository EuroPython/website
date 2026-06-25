/**
 * Shared bingo card SVG generation — used both client-side (BingoCard.svelte)
 * and server-side (API OG image endpoint).
 */
import { EDITIONS } from "./editions";

export interface BingoCardSvgOptions {
  /** Array of 25 booleans, true = cell is flipped/attended */
  checked: boolean[];
  /** Whether to render in dark mode colors */
  isDark?: boolean;
}

const CELL = 124;
const GAP = 6;
const PAD = 20;
const HEADER_H = 74;
const FOOTER_H = 46;
const COLS = 5;
const ROWS = 5;
export const SVG_W = COLS * CELL + (COLS - 1) * GAP + PAD * 2;
export const SVG_H =
  HEADER_H + ROWS * CELL + (ROWS - 1) * GAP + FOOTER_H + PAD * 2;

export function generateBingoSvg({
  checked,
  isDark = true,
}: BingoCardSvgOptions): string {
  const bgColor = isDark ? "#0b1121" : "#f5f0eb";
  const textColor = isDark ? "#ffffff" : "#1a1a2e";
  const accentColor = isDark ? "#f0c040" : "#1a56db";
  const mutedColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const cellBg = isDark ? "#0d1520" : "#ffffff";
  const cellBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const flippedBg = isDark ? "#f0c040" : "#1a56db";
  const flippedText = isDark ? "#0b1121" : "#ffffff";
  const count = checked.filter(Boolean).length;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${SVG_H}" viewBox="0 0 ${SVG_W} ${SVG_H}">
    <defs>
      <style>
        .title { font: bold 26px system-ui, sans-serif; fill: ${textColor}; text-anchor: middle; }
        .sub { font: 12px system-ui, sans-serif; fill: ${mutedColor}; text-anchor: middle; }
        .year-f { font: bold 20px system-ui, sans-serif; fill: ${textColor}; text-anchor: middle; }
        .city-f { font: 11px system-ui, sans-serif; fill: ${mutedColor}; text-anchor: middle; }
        .year-b { font: bold 20px system-ui, sans-serif; fill: ${flippedText}; text-anchor: middle; }
        .city-b { font: 11px system-ui, sans-serif; fill: ${flippedText}; text-anchor: middle; opacity: 0.65; }
        .watermark { font: bold 56px system-ui, sans-serif; fill: ${accentColor}; text-anchor: middle; opacity: 0.12; }
      </style>
    </defs>
    <rect width="${SVG_W}" height="${SVG_H}" fill="${bgColor}" rx="4"/>
    <text x="${SVG_W / 2}" y="38" class="title">EuroPython Bingo</text>
    <text x="${SVG_W / 2}" y="58" class="sub">${count} of 25 editions</text>`;

  EDITIONS.forEach((ed, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CELL + GAP);
    const y = HEADER_H + row * (CELL + GAP);
    const flip = checked[i];

    svg += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${flip ? flippedBg : cellBg}" stroke="${flip ? accentColor : cellBorder}" stroke-width="${flip ? 2 : 1}"/>`;

    if (flip) {
      svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.48}" class="year-b">${ed.year}</text>`;
      svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.66}" class="city-b">${ed.city}</text>`;
    } else {
      svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.48}" class="city-f">${ed.city}</text>`;
      svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.66}" class="year-f">${ed.year}</text>`;
    }
  });

  svg += `<text x="${SVG_W / 2}" y="${SVG_H - FOOTER_H / 2 + 8}" class="watermark">EuroPython 2026</text>`;
  svg += `</svg>`;

  return svg;
}
