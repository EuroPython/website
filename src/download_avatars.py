"""Download and resize speaker avatars for production builds.

Usage:
    uv run src/download_avatars.py

Reads speaker codes from data/speakers.json, downloads their avatars,
resizes to preset sizes (80, 200, 400px) and saves as WebP to avatars/.

Skips files that already exist — safe to run incrementally.
"""

import json
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

_ROOT = Path(__file__).resolve().parent.parent
_SIZES = [80, 200, 400]
_AVATARS_DIR = _ROOT / "avatars"
_SPEAKERS_FILE = _ROOT / "data" / "speakers.json"


def _download_and_resize(url: str, stem: str) -> int:
    """Download avatar and save at all preset sizes. Returns number of files written."""
    targets = [_AVATARS_DIR / f"{stem}-{size}.webp" for size in _SIZES]
    if all(t.exists() for t in targets):
        return 0  # already done

    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = resp.read()
    except Exception as e:
        print(f"  WARN: failed to download {url}: {e}")
        return 0

    try:
        img = Image.open(BytesIO(data)).convert("RGB")
    except Exception as e:
        print(f"  WARN: failed to open image {url}: {e}")
        return 0

    written = 0
    for size, target in zip(_SIZES, targets, strict=True):
        if target.exists():
            continue
        thumb = img.copy()
        thumb.thumbnail((size, size), Image.LANCZOS)
        thumb.save(target, "WEBP", quality=85)
        written += 1

    return written


def main() -> None:
    if not _SPEAKERS_FILE.exists():
        print(f"ERROR: {_SPEAKERS_FILE} not found — run make download-data first")
        return

    _AVATARS_DIR.mkdir(exist_ok=True)
    speakers = json.loads(_SPEAKERS_FILE.read_text())

    total = skipped = written = 0
    for code, data in speakers.items():
        url = data.get("avatar")
        if not url:
            continue
        total += 1
        stem = Path(url.split("?")[0]).stem
        n = _download_and_resize(url, stem)
        if n == 0:
            skipped += 1
        else:
            written += n
            print(f"  {code}: {stem} ({n} sizes)")

    print(f"\ndone: {total} speakers, {written} files written, {skipped} skipped (already exist)")


if __name__ == "__main__":
    main()
