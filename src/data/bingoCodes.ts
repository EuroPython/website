/**
 * 12 winning bingo line combinations.
 * Each code maps to specific cell indices on the 5×5 bingo grid.
 */

interface BingoLine {
  code: string;
  label: string;
  cells: number[];
}

export const BINGO_LINES: BingoLine[] = [
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

export function getLineByCode(code: string): BingoLine | undefined {
  return BINGO_LINES.find((l) => l.code === code);
}

export function getCodeForCells(cells: number[]): string | undefined {
  const sorted = [...cells].sort((a, b) => a - b);
  const match = BINGO_LINES.find(
    (l) => [...l.cells].sort((a, b) => a - b).join(",") === sorted.join(",")
  );
  return match?.code;
}
