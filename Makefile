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
BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)
SAFE_BRANCH := $(shell echo "$(BRANCH)" | sed 's/[^A-Za-z0-9-]/-/g')
FORCE_DEPLOY ?= false
SITE_URL ?= "https://$(SAFE_BRANCH).ep-preview.click"

.PHONY: build deploy dev clean install safe_branch preview clean-previews prune-prod-releases

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

preview: RELEASES_DIR = $(VPS_PREVIEW_PATH)/$(SAFE_BRANCH)/releases
preview: TARGET = $(RELEASES_DIR)/$(TIMESTAMP)
preview:
	@echo "Preview site URL: $(PREVIEW_SITE_URL)"
	echo $(TARGET)
	@echo "\n\n**** Deploying preview of a branch '$(BRANCH)' (safe: $(SAFE_BRANCH)) to $(TARGET)...\n\n"
	$(REMOTE_CMD) "mkdir -p $(TARGET)"
	rsync -avz --delete ./dist/ $(VPS_USER)@$(VPS_HOST):$(TARGET)/
	$(REMOTE_CMD) "cd $(RELEASES_DIR) && ln -snf $(TIMESTAMP) current && \
		find . -maxdepth 1 -mindepth 1 -type d ! -name $(TIMESTAMP) -exec rm -rf {} +"
	@echo "\n\n**** Preview complete.\n\n"
	@echo "Open the preview site at: $(PREVIEW_SITE_URL)\n\n"

ifeq ($(FORCE_DEPLOY), true)
deploy: RELEASES_DIR = $(VPS_PROD_PATH)/releases
deploy: TARGET = $(RELEASES_DIR)/$(TIMESTAMP)
deploy: clean-previews prune-prod-releases
deploy:
	@echo "\n\n**** Deploying branch '$(BRANCH)' (safe: $(SAFE_BRANCH)) to $(TARGET)...\n\n"
	$(REMOTE_CMD) "mkdir -p $(TARGET)"
	rsync -avz --delete ./dist/ $(VPS_USER)@$(VPS_HOST):$(TARGET)/
	$(REMOTE_CMD) "cd $(RELEASES_DIR) && ln -snf $(TIMESTAMP) current"
	@echo "\n\n**** Deployment complete.\n\n"
endif

# Cleanup preview builds that no longer match any remote branches
# Lets test it with some comment.
clean-previews:
	@echo "\n\n**** Cleaning up preview builds of deleted branches...\n\n"
	$(REMOTE_CMD) 'cd $(VPS_PREVIEW_PATH) && \
	for d in *; do \
		if ! git ls-remote --heads https://github.com/YOUR_ORG/YOUR_REPO.git "$$d" | grep -q "$$d"; then \
			echo "Removing preview branch: $$d"; \
			rm -rf "$$d"; \
		fi \
	done'

# Keep only latest 10 production builds
prune-prod-releases:
	@echo "\n\n**** Pruning old production builds, keeping latest 10...\n\n"
	$(REMOTE_CMD) 'cd $(VPS_PROD_PATH)/releases && \
	ls -1dt */ | tail -n +11 | xargs -r rm -rf'
