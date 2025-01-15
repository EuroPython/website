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
	$(if $(findstring Windows_NT, $(OS)), \
		$(error Deployment is not supported on Windows. Use WSL or a Unix-like system.), \
		@read -p "Enter SSH username: " USERNAME; \
		read -p "Enter inline inventory (e.g., 'host1,' (DO NOT forget the trailing comma)): " INVENTORY; \
		ansible-playbook -u $$USERNAME -i "$$INVENTORY" deploy.yml)

clean:
	git clean -fdX

.PHONY: pre install dev build deploy clean
