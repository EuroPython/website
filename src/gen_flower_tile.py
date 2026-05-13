#!/usr/bin/env python3
"""Generate flower SVG assets: seamless tile and bouquet separator."""

import random
import re
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
_FLOWERS_DIR = _ROOT / "flowers" / "individual"
_OUTPUT_TILE = _ROOT / "flowers" / "flowers-tile.svg"
_OUTPUT_SEPARATOR = _ROOT / "flowers" / "flowers-separator.svg"

# Tile settings
CANVAS = 2400
TILE_SEED = 42
TILE_N = 140
TILE_MIN_SIZE = 60
TILE_MAX_SIZE = 130
TILE_MIN_GAP = 10
MAX_ATTEMPTS = 500

# Separator tile settings (seamlessly repeating horizontal strip)
SEP_WIDTH = 600
SEP_HEIGHT = 120
SEP_SEED = 77
SEP_N = 30
SEP_MIN_SIZE = 84
SEP_MAX_SIZE = 196
SEP_MIN_GAP = -100  # negative = allow heavy overlap


# SVG helpers
# ===========


def _parse_svg(path: Path) -> tuple[str, str]:
    """Extract viewBox and inner content from an SVG file."""
    text = path.read_text()
    vb_match = re.search(r'viewBox="([^"]+)"', text)
    viewbox = vb_match.group(1) if vb_match else "0 0 100 100"
    inner_match = re.search(r"<svg[^>]*>(.*)</svg>", text, re.DOTALL)
    inner = inner_match.group(1) if inner_match else ""
    return viewbox, inner


def _load_flowers() -> list[tuple[str, str, str]]:
    """Load all flower SVGs, returning (id, viewBox, inner_xml) tuples."""
    flowers = []
    for path in sorted(_FLOWERS_DIR.glob("*.svg")):
        flower_id = path.stem
        viewbox, inner = _parse_svg(path)
        flowers.append((flower_id, viewbox, inner))
    return flowers


def _build_symbols(flowers: list[tuple[str, str, str]]) -> list[str]:
    """Build <symbol> definitions for all flowers."""
    return [f'  <symbol id="{fid}" viewBox="{vb}">{inner}</symbol>' for fid, vb, inner in flowers]


def _use_element(flower_id: str, x: float, y: float, size: float, rotation: float, flip: int) -> str:
    """Create a <use> element with transform."""
    sx = flip * size
    cx, cy = x + size / 2, y + size / 2
    transform = (
        f"translate({cx:.1f},{cy:.1f}) "
        f"rotate({rotation:.1f}) "
        f"scale({sx / size:.3f},{size / size:.3f}) "
        f"translate({-size / 2:.1f},{-size / 2:.1f})"
    )
    return f'  <use href="#{flower_id}" x="0" y="0" width="{size:.0f}" height="{size:.0f}" transform="{transform}"/>'


def _circles_overlap(
    cx: float,
    cy: float,
    r: float,
    placed: list[tuple[float, float, float]],
    min_gap: float,
    *,
    toroidal_w: float = 0,
    toroidal_h: float = 0,
) -> bool:
    """Check if a circle overlaps any placed circle.

    If toroidal_w/h > 0, uses toroidal distance for seamless wrapping.
    """
    for px, py, pr in placed:
        min_dist = r + pr + min_gap
        dx = abs(cx - px)
        dy = abs(cy - py)
        if toroidal_w > 0 and dx > toroidal_w / 2:
            dx = toroidal_w - dx
        if toroidal_h > 0 and dy > toroidal_h / 2:
            dy = toroidal_h - dy
        if dx * dx + dy * dy < min_dist * min_dist:
            return True
    return False


# Tile generator
# ==============


def _build_tile(flowers: list[tuple[str, str, str]]) -> str:
    """Build the seamless tiling SVG."""
    rng = random.Random(TILE_SEED)
    symbols = _build_symbols(flowers)

    placed: list[tuple[float, float, float]] = []
    placements = []

    for _ in range(TILE_N):
        for _ in range(MAX_ATTEMPTS):
            flower_id, _, _ = rng.choice(flowers)
            x = rng.uniform(0, CANVAS)
            y = rng.uniform(0, CANVAS)
            size = rng.uniform(TILE_MIN_SIZE, TILE_MAX_SIZE)
            cx, cy, r = x + size / 2, y + size / 2, size / 2

            if not _circles_overlap(cx, cy, r, placed, TILE_MIN_GAP, toroidal_w=CANVAS, toroidal_h=CANVAS):
                rotation = rng.uniform(0, 360)
                flip = rng.choice([1, -1])
                placements.append((flower_id, x, y, size, rotation, flip))
                placed.append((cx, cy, r))
                break

    print(f"  tile: placed {len(placements)}/{TILE_N} flowers")

    uses = []
    for flower_id, x, y, size, rotation, flip in placements:
        for px, py in _wrap_positions(x, y, size):
            uses.append(_use_element(flower_id, px, py, size, rotation, flip))

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n'
        f'     viewBox="0 0 {CANVAS} {CANVAS}" width="{CANVAS}" height="{CANVAS}">\n'
        f"<defs>\n{chr(10).join(symbols)}\n</defs>\n"
        f"{chr(10).join(uses)}\n</svg>\n"
    )


def _wrap_positions(x: float, y: float, size: float) -> list[tuple[float, float]]:
    """Return all positions needed for seamless wrapping."""
    positions = [(x, y)]
    wraps_right = x + size > CANVAS
    wraps_bottom = y + size > CANVAS
    if wraps_right:
        positions.append((x - CANVAS, y))
    if wraps_bottom:
        positions.append((x, y - CANVAS))
    if wraps_right and wraps_bottom:
        positions.append((x - CANVAS, y - CANVAS))
    return positions


# Separator/bouquet generator
# ===========================


def _build_separator(flowers: list[tuple[str, str, str]]) -> str:
    """Build a dense, seamlessly tiling horizontal flower strip.

    Flowers are packed uniformly across the full canvas. The tile wraps
    horizontally so it can be used as `background: repeat-x`.
    """
    rng = random.Random(SEP_SEED)
    symbols = _build_symbols(flowers)

    flower_choices = [f for f in flowers if not f[0].startswith("rooster")]

    placed: list[tuple[float, float, float]] = []
    placements = []

    for _ in range(SEP_N):
        for _ in range(MAX_ATTEMPTS):
            flower_id, _, _ = rng.choice(flower_choices)
            x = rng.uniform(0, SEP_WIDTH)
            # Gaussian vertical clustering around the middle
            y_center = rng.gauss(SEP_HEIGHT / 2, SEP_HEIGHT * 0.12)
            size = rng.uniform(SEP_MIN_SIZE, SEP_MAX_SIZE)
            y = y_center - size / 2
            cx, cy, r = x + size / 2, y_center, size / 2

            if not _circles_overlap(cx, cy, r, placed, SEP_MIN_GAP, toroidal_w=SEP_WIDTH):
                rotation = rng.uniform(0, 360)
                flip = rng.choice([1, -1])
                placements.append((flower_id, x, y, size, rotation, flip))
                placed.append((cx, cy, r))
                break

    print(f"  separator: placed {len(placements)}/{SEP_N} flowers")

    # Sort by size descending so large flowers render behind small ones
    placements.sort(key=lambda p: -p[3])

    # Generate <use> elements with horizontal wrapping
    uses = []
    for flower_id, x, y, size, rotation, flip in placements:
        uses.append(_use_element(flower_id, x, y, size, rotation, flip))
        # Wrap flowers that cross the right edge
        if x + size > SEP_WIDTH:
            uses.append(_use_element(flower_id, x - SEP_WIDTH, y, size, rotation, flip))

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n'
        f'     viewBox="0 0 {SEP_WIDTH} {SEP_HEIGHT}" width="{SEP_WIDTH}" height="{SEP_HEIGHT}">\n'
        f"<defs>\n{chr(10).join(symbols)}\n</defs>\n"
        f"{chr(10).join(uses)}\n</svg>\n"
    )


# Main
# ====


def main():
    flowers = _load_flowers()
    print(f"Loaded {len(flowers)} flower SVGs")

    tile_svg = _build_tile(flowers)
    _OUTPUT_TILE.parent.mkdir(parents=True, exist_ok=True)
    _OUTPUT_TILE.write_text(tile_svg)
    print(f"  → {_OUTPUT_TILE.name} ({len(tile_svg):,} bytes)")

    sep_svg = _build_separator(flowers)
    _OUTPUT_SEPARATOR.write_text(sep_svg)
    print(f"  → {_OUTPUT_SEPARATOR.name} ({len(sep_svg):,} bytes)")


if __name__ == "__main__":
    main()
