# EuroPython Website

## Introduction

Welcome to the repository for the EuroPython website! We use Python with
[Jinja2](https://jinja.palletsprojects.com/) templates and `uv` to manage
dependencies.

## Setup

### Local dev env

To get started, clone the repository and install dependencies:

```sh
uv sync
```

Then start the development server with live reload:

```sh
make dev
```

The website will be available at `http://localhost:4321`.

For a full production build:

```sh
make build-all ENV=production
```

`ENV` defaults to `development`. The corresponding `.env.<ENV>` file is loaded
automatically.

### Docker

If you want to run this in docker, run:

```sh
docker compose build
docker compose up
```

The website will be available at `http://localhost:4321`.

#### Docker Troubleshooting

Docker Compose mounts volumes from your file system to enable live reload. If
you're having problems starting the container, try:

```sh
# Clean everything
docker compose down -v       # Remove volumes (including .venv and uv-cache)
docker image rmi ep26-web    # Clean unused images
docker rm ep26-web           # Clean unused containers

# Rebuild from scratch
docker compose build --no-cache
docker compose up
```

## Content Structure

The content of the site is stored in `src/content/`. The build is driven by
`src/build.py` using Jinja2 templates from `src/templates/`.

### Pages

Pages are stored in the `src/content/pages/` directory as Markdown files.

### Deadlines

Important deadlines are located in the `src/content/deadlines/` directory.

## Programme Data

Programme data (sessions, speakers, schedule) is fetched from the pretalx API
and stored in `data/` (gitignored). Run once before building:

```sh
make download-data
```

## Speaker Avatars

Speaker avatars are optimised per environment:

| ENV | Strategy | How |
|-----|----------|-----|
| `development` | wsrv.nl proxy | No local download needed |
| `preview` | wsrv.nl proxy | `EP_AVATAR_PROXY=true` in `.env.preview` |
| `production` | Local files | Downloaded and resized via `make download-avatars` |

In **development and preview**, avatar URLs are rewritten through
[wsrv.nl](https://wsrv.nl) which resizes and caches them on the fly — no local
storage or bandwidth required.

In **production**, avatars are downloaded, resized to 80/200/400px WebP, and
stored in `avatars/` (gitignored). Run once before the production build:

```sh
make download-avatars  # requires data/speakers.json to exist first
make build-all ENV=production
```

The `avatars/` directory is safe to delete and re-generate at any time.

## Environment Variables

All env vars are loaded from `.env.<ENV>` (default: `.env.development`).
Pass `ENV=preview` or `ENV=production` to `make` to switch environments.

| Variable | Description |
|----------|-------------|
| `EP_SESSIONS_API` | Sessions JSON URL |
| `EP_SPEAKERS_API` | Speakers JSON URL |
| `EP_SCHEDULE_API` | Schedule JSON URL |
| `EP_FAST_BUILD` | Skip detail pages when `true` |
| `EP_MINIFY` | Minify CSS/JS when `true` |
| `EP_AVATAR_PROXY` | Force wsrv.nl proxy for avatars when `true` |
| `SITE_URL` | Base URL used in canonical links and redirects |

## Development

| Command                   | Description                                    |
|---------------------------|------------------------------------------------|
| `make dev`                | Build and start dev server with live reload    |
| `make build`              | Build the site (fast, no detail pages)         |
| `make build-all`          | Full build including session/speaker pages     |
| `make download-data`      | Fetch sessions, speakers, schedule from API    |
| `make download-avatars`   | Download and resize speaker avatars locally    |
| `make test`               | Run tests                                      |
| `make lint`               | Lint with ruff                                 |
| `make format`             | Format with ruff                               |
| `make type-check`         | Type-check with mypy                           |
