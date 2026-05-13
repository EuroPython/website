.PHONY: build build-all clean deploy ship serve server lint format type-check test test-cov download-data download-avatars watch dev preview safe_branch

#
# Variables for remote host
# =========================
VPS_USER  ?= static_content_user
VPS_HOST  ?= static.europython.eu
VPS_PROD_PATH  ?= /home/static_content_user/content/europython_websites/ep2026
VPS_PREVIEW_PATH  ?= /home/static_content_user/content/previews
REMOTE_CMD=ssh $(VPS_USER)@$(VPS_HOST)

#
# Variables for build/deploy
# ==========================
export TIMESTAMP ?= $(shell date +%Y%m%d%H%M%S)

#
# Variables for deploy
# ====================
BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)
SAFE_BRANCH := $(shell echo "$(BRANCH)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
FORCE_DEPLOY ?= false
PREVIEW_SITE_URL ?= "https://$(SAFE_BRANCH).ep-preview.click"

ENV ?= development
-include .env.$(ENV)
export EP_SESSIONS_API EP_SPEAKERS_API EP_SCHEDULE_API EP_FAST_BUILD EP_MINIFY EP_AVATAR_PROXY SITE_URL

GIT_COMMIT := $(shell git rev-parse --short=8 HEAD 2>/dev/null)

safe_branch:
	@echo $(SAFE_BRANCH)

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

preview: RELEASES_DIR = $(VPS_PREVIEW_PATH)/$(SAFE_BRANCH)/releases
preview: TARGET = $(RELEASES_DIR)/$(TIMESTAMP)
preview: build-all
preview:
	@echo "\n\n**** Deploying preview of a branch '$(BRANCH)' (safe: $(SAFE_BRANCH)) to $(TARGET)...\n\n"
	$(REMOTE_CMD) "mkdir -p $(TARGET)"
	rsync -avz --delete ./build/ $(VPS_USER)@$(VPS_HOST):$(TARGET)/
	$(REMOTE_CMD) "cd $(RELEASES_DIR) && ln -snf $(TIMESTAMP) current"
	@echo "\n\n**** Preview complete.\n\n"
	@echo "Open the preview site at: $(PREVIEW_SITE_URL)\n\n"
	@echo "\n**** Cleaning up old releases (keep latest 3, skip 'current')...\n"
	$(REMOTE_CMD) "bash -c '\
cd $(RELEASES_DIR) && \
echo \"[INFO] Cleaning:\" && \
ls -1 */ \
	| sed \"s:/*\\\$$::\" \
  | grep \"^2026\" \
  | sort -r \
  | tail -n +4 \
  | xargs -r -I{} echo rm -rf \"{}\"'"

ifeq ($(FORCE_DEPLOY), true)
deploy: RELEASES_DIR = $(VPS_PROD_PATH)/releases
deploy: TARGET = $(RELEASES_DIR)/$(TIMESTAMP)
deploy:
	@echo "\n\n**** Deploying branch '$(BRANCH)' (safe: $(SAFE_BRANCH)) to $(TARGET)...\n\n"
	$(REMOTE_CMD) "mkdir -p $(TARGET)"
	rsync -avz --delete ./build/ $(VPS_USER)@$(VPS_HOST):$(TARGET)/
	$(REMOTE_CMD) "cd $(RELEASES_DIR) && ln -snf $(TIMESTAMP) current"
	@echo "\n\n**** Deployment complete.\n\n"
endif
