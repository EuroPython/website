"""Dev server with live reload and automatic browser refresh."""

import argparse
import subprocess
from pathlib import Path

from livereload import Server

DEFAULT_PORT = 4321
BUILD_DIR = Path(__file__).resolve().parent.parent / "build"
WATCH_DIRS = ["src", "public"]


def _build() -> None:
    print("[serve] building...")
    subprocess.run(["make", "build-all"], check=True)
    print("[serve] done")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--host", default="")
    args = parser.parse_args()

    server = Server()

    root = BUILD_DIR.parent
    for d in WATCH_DIRS:
        server.watch(
            str(root / d),
            func=_build,
            ignore=lambda p: "__pycache__" in p or p.endswith(".pyc"),
        )

    print(f"[serve] http://{args.host or 'localhost'}:{args.port}  (Ctrl+C to stop)")
    server.serve(
        port=args.port,
        host=args.host or "localhost",
        root=str(BUILD_DIR),
        live_css=True,
    )


if __name__ == "__main__":
    main()
