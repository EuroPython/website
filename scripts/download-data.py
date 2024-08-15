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


SESSIONS_URL = "https://gist.githubusercontent.com/egeakman/cfcdc4c06497945dd88a981e912849e3/raw/c8394edf1d6c873323d9a602035e9c2782edc5c7/sessions.json"
SPEAKERS_URL = "https://gist.githubusercontent.com/egeakman/d57119da59ee49d16a1c5d425b073463/raw/dd26645859f7733ceed542782b8f141df08da951/speakers.json"
SCHEDULE_DATA = "https://gist.githubusercontent.com/egeakman/4d45050d7e0c483092d2337c3f0fbee5/raw/1affcfe69d8de77f60913091c652625d152a43b3/schedule.json"


def write_mdx(data: dict[str, Any], output_dir: pathlib.Path, content_key: str) -> None:
    if output_dir.exists():
        shutil.rmtree(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    for key, value in data.items():
        filename = f"{key}.mdx"
        path = output_dir / filename

        content = value.pop(content_key) or ""

        content = content.replace("<3", "❤️")

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
    schedule = download_data(SCHEDULE_DATA)

    for session in sessions.values():
        session["speakers"] = [
            speakers[speaker_id]["slug"] for speaker_id in session.get("speakers", [])
        ]

    for speaker in speakers.values():
        speaker["submissions"] = [
            sessions[session_id]["slug"]
            for session_id in speaker.get("submissions", [])
            if session_id in sessions
        ]

    write_mdx(sessions, ROOT / "src/content/sessions", "abstract")
    write_mdx(speakers, ROOT / "src/content/speakers", "biography")

    for day, data in schedule["days"].items():
        path = ROOT / f"src/content/days/{day}.json"
        with path.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)


download()
