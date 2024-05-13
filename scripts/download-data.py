# /// script
# dependencies = [
#   "httpx",
#   "PyYAML",
# ]
# requires-python = ">=3.11"
# ///

import httpx
import json
import pathlib
import shutil
import yaml

ROOT = pathlib.Path(__file__).parents[1]


SESSIONS_URL = "https://programapi24.europython.eu/2024/sessions.json"
SPEAKERS_URL = "https://programapi24.europython.eu/2024/speakers.json"


def download_sessions() -> None:
    output_dir = ROOT / "src/content/sessions"

    if output_dir.exists():
        shutil.rmtree(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    with httpx.Client() as client:
        response = client.get(SESSIONS_URL)
        response.raise_for_status()
        data = response.json()

    for key, value in data.items():
        filename = f"{key}.mdx"
        path = output_dir / filename

        content = value.pop("abstract")

        frontmatter = yaml.dump(value, sort_keys=True)

        with path.open("w", encoding="utf-8") as f:
            f.write(f"---\n{frontmatter}---\n\n{content}")


def download_speakers() -> None:
    output_dir = ROOT / "src/content/speakers"

    if output_dir.exists():
        shutil.rmtree(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    with httpx.Client() as client:
        response = client.get(SPEAKERS_URL)
        response.raise_for_status()
        data = response.json()

    for key, value in data.items():
        filename = f"{key}.json"
        path = output_dir / filename

        with path.open("w", encoding="utf-8") as f:
            json.dump(value, f, indent=2, sort_keys=True, ensure_ascii=False)


download_sessions()
download_speakers()
