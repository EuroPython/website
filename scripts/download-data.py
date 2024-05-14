# /// script
# dependencies = [
#   "httpx",
#   "PyYAML",
# ]
# requires-python = ">=3.11"
# ///

from typing import Any
import httpx
import json
import pathlib
import shutil
import yaml

ROOT = pathlib.Path(__file__).parents[1]


SESSIONS_URL = "https://programapi24.europython.eu/2024/sessions.json"
SPEAKERS_URL = "https://programapi24.europython.eu/2024/speakers.json"


def write_mdx(data: dict[str, Any], output_dir: pathlib.Path, content_key: str) -> None:
    if output_dir.exists():
        shutil.rmtree(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    for key, value in data.items():
        filename = f"{key}.mdx"
        path = output_dir / filename

        content = value.pop(content_key)

        frontmatter = yaml.dump(value, sort_keys=True)

        with path.open("w", encoding="utf-8") as f:
            f.write(f"---\n{frontmatter}---\n\n{content}")


def download_data(url: str) -> dict[str, Any]:
    with httpx.Client() as client:
        response = client.get(url)
        response.raise_for_status()
        data = response.json()

    return data


def download() -> None:
    speakers = download_data(SPEAKERS_URL)
    sessions = download_data(SESSIONS_URL)

    for session in sessions.values():
        speaker_ids = session.get("speaker_ids", [])
        session["speakers"] = [
            speakers[speaker_id]["slug"] for speaker_id in speaker_ids
        ]

    write_mdx(sessions, ROOT / "src/content/sessions", "abstract")
    write_mdx(speakers, ROOT / "src/content/speakers", "biography")


download()
