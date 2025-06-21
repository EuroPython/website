#
# Variables for remote host
# =========================
VPS_USER  ?= static_content_user
VPS_HOST  ?= static.europython.eu
VPS_PROD_PATH  ?= /home/static_content_user/content/europython_websites/ep2025
VPS_PREVIEW_PATH  ?= /home/static_content_user/content/previews
REMOTE_CMD=ssh $(VPS_USER)@$(VPS_HOST)
PREVIEW_SITE_URL ?= "https://$(SAFE_BRANCH).ep-preview.click"

# Variables for build/deploy
# ==========================
export TIMESTAMP ?= $(shell date +%Y%m%d%H%M%S)
export GIT_VERSION ?= $(shell git rev-parse --short HEAD)

# Variables for deploy
# ====================
# Auto-detect and sanitize current git branch
BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)
# Replace "/" and other non-alphanumeric characters with "-"
SAFE_BRANCH := $(shell echo "$(BRANCH)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
FORCE_DEPLOY ?= false
SITE_URL ?= "https://$(SAFE_BRANCH).ep-preview.click"

.PHONY: build deploy dev clean install

safe_branch:
	@echo $(SAFE_BRANCH)

pre:
	npm install -g pnpm

install:
	pnpm install

dev:
	pnpm dev

clean:
	git clean -fdX

check:
	pnpm run astro check

build:
	pnpm run astro build --mode $(MODE)
	pnpm pagefind

preview: RELEASES_DIR = $(VPS_PREVIEW_PATH)/$(SAFE_BRANCH)/releases
preview: TARGET = $(RELEASES_DIR)/$(TIMESTAMP)
preview:
	@echo "Preview site URL: $(PREVIEW_SITE_URL)"
	echo $(TARGET)
	@echo "\n\n**** Deploying preview of a branch '$(BRANCH)' (safe: $(SAFE_BRANCH)) to $(TARGET)...\n\n"
	$(REMOTE_CMD) "mkdir -p $(TARGET)"
	rsync -avz --delete ./dist/ $(VPS_USER)@$(VPS_HOST):$(TARGET)/
	$(REMOTE_CMD) "cd $(RELEASES_DIR) && ln -snf $(TIMESTAMP) current"
	@echo "\n\n**** Preview complete.\n\n"
	@echo "Open the preview site at: $(PREVIEW_SITE_URL)\n\n"
	@echo "\n**** Cleaning up old releases (keep latest 3, skip 'current')...\n"
	$(REMOTE_CMD) 'bash -c "cd $(RELEASES_DIR) && \
	for dir in $(ls -1dt */ | sed \"s:/*$$::\" | grep -v ^current$$ | grep -v ^$(TIMESTAMP)$$ | tail -n +2); do \
		echo rm -rf \"$$dir\"; \
	done"' | tee /dev/stdout


ifeq ($(FORCE_DEPLOY), true)
deploy: RELEASES_DIR = $(VPS_PROD_PATH)/releases
deploy: TARGET = $(RELEASES_DIR)/$(TIMESTAMP)
deploy:
	@echo "\n\n**** Deploying branch '$(BRANCH)' (safe: $(SAFE_BRANCH)) to $(TARGET)...\n\n"
	$(REMOTE_CMD) "mkdir -p $(TARGET)"
	rsync -avz --delete ./dist/ $(VPS_USER)@$(VPS_HOST):$(TARGET)/
	$(REMOTE_CMD) "cd $(RELEASES_DIR) && ln -snf $(TIMESTAMP) current"
	@echo "\n\n**** Deployment complete.\n\n"
endif
