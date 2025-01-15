pre:
	python -m pip install pre-commit ansible
	pre-commit install
	npm install -g pnpm

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

deploy:
	$(if $(FORCE),$(if $(filter 1,$(FORCE)), \
	@echo TO BE IMPLEMENTED, \
	$(error FORCE must be set to 1)),$(error Use 'make deploy FORCE=1' to deploy))

clean:
	git clean -fdX

.PHONY: pre install dev build deploy clean
