# EuroPython Website 🌍🐍

## Introduction 👋

Welcome to the repository for the EuroPython website! We use
[Astro](https://astro.build) in combination with pnpm to manage dependencies.

## Setup 🛠️

### Local dev env

To get started, clone the repository and run `pnpm install` to fetch all the
dependencies. Then, use `pnpm run dev` to start the development server.

The website will be available at `http://localhost:4321`.

### Prek Setup

To ensure code quality and consistency, we use `pre-commit` hooks. Follow these
steps to set up `prek` on your local environment:

1. Install `prek`. You can follow the instructions from
   [prek.j178.dev](https://prek.j178.dev/installation/).
2. Run `prek install` in the root of your local repository.
3. Now, `prek` will run automatically on `git commit`. You can also run it
   manually on all files using `prek run --all-files`.

This will help maintain a consistent coding style and catch common issues before
submission.

### Docker

If you want to run this in docker, run:

```sh
docker compose build
docker compose up
```

The website will be available at `http://localhost:4321`.

#### Docker Troubleshooting

Docker Compose mounts volumes from your file system to enable live reload. If
you're having problems starting the container, try this:

```sh
# Clean everything
docker compose down -v  # Remove volumes
docker image rmi website-web # Clean unused images
docker rm website-web # Clean unused containers

# Remove local pnpm store if it exists
rm -rf .pnpm-store

# Rebuild from scratch
docker compose build --no-cache
docker compose up
```

## Content Structure 🗂️

The content of the site is store in this repository. We are using Astro's
content collections to manage the content. The collections are configure inside
`src/content/config.ts`.

### Pages

Pages are stored in the `src/content/pages` directory. Each page is a md file
with frontmatter.

### Deadlines

Meanwhile, our important deadlines ⏰ are located inside the
`src/content/deadlines` directory.
