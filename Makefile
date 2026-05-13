.PHONY: build build-all clean deploy ship serve server lint format type-check test test-cov download-data download-avatars watch dev

ENV ?= development
-include .env.$(ENV)
export EP_SESSIONS_API EP_SPEAKERS_API EP_SCHEDULE_API EP_FAST_BUILD EP_MINIFY EP_AVATAR_PROXY SITE_URL

GIT_COMMIT := $(shell git rev-parse --short=8 HEAD 2>/dev/null)

build:
	uv run src/build.py --commit $(GIT_COMMIT)

build-all:
	uv run src/build.py --all --commit $(GIT_COMMIT)

clean:
	rm -rf build

lint:
	uv run ruff check src/

format:
	uv run ruff format src/

type-check:
	uv run mypy

test:
	uv run pytest

test-cov:
	uv run pytest --cov-report=html

download-data:
	mkdir -p data
	wget -q -O data/speakers.json $(EP_SPEAKERS_API)
	wget -q -O data/sessions.json $(EP_SESSIONS_API)
	wget -q -O data/schedule.json $(EP_SCHEDULE_API)
	@echo "  downloaded speakers, sessions and schedule -> data/"

download-avatars:
	uv run src/download_avatars.py


watch:
	uvx watchfiles 'make build-all' src/ public/

dev: build-all
	uv run python src/serve.py --port 4321

ship: build-all deploy

deploy:
	rsync -avz --delete build/ static_content_user@ls.artcz.pl:/home/static_content_user/content/ep26/

