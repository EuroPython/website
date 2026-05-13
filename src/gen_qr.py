"""Generate a styled SVG QR code for the sponsor page."""

from pathlib import Path

import segno

_ROOT = Path(__file__).resolve().parent.parent

URL = "https://europython.eu/sponsor"
OUTPUT = _ROOT / "sponsor-qr.svg"

EP_URL = "https://europython.eu"
EP_OUTPUT_LIGHT = _ROOT / "ep-qr-light.svg"

# Colors matching the site theme
# Dark background (#0a0a1a), bright foreground for contrast
DARK = "#0a0a1a"
LIGHT = "#fff5f0"  # --cream

# Light-mode version (dark modules on light bg)
OUTPUT_LIGHT = _ROOT / "sponsor-qr-light.svg"


def _save_qr(url: str, path: Path, *, dark: str, light: str) -> None:
    qr = segno.make(url, error="H")
    qr.save(str(path), kind="svg", dark=dark, light=light, border=2, scale=8)
    print(f"QR code saved to {path}")


def main() -> None:
    _save_qr(URL, OUTPUT, dark=LIGHT, light=DARK)
    _save_qr(URL, OUTPUT_LIGHT, dark=DARK, light=LIGHT)
    _save_qr(EP_URL, EP_OUTPUT_LIGHT, dark=DARK, light=LIGHT)


if __name__ == "__main__":
    main()
