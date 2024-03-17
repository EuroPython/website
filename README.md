# EuroPython Website 🌍🐍

## Introduction 👋

Welcome to the repository for the EuroPython website! We use
[Astro](https://astro.build) in combination with pnpm to manage dependencies.

## Setup 🛠️

To get started, clone the repository and run `pnpm install` to fetch all the
dependencies. Then, use `pnpm run dev` to start the development server.

The website will be available at `http://localhost:4321`.

## Content Structure 🗂️

The content of the site is store in this repository. We are using Astro's
content collections to manage the content. The collections are configure inside
`src/content/config.ts`.

### Pages

Pages are stored in the `src/content/pages` directory. Each page is a mdx file
with frontmatter.

### Deadlines

Meanwhile, our important deadlines ⏰ are located inside the
`src/content/deadlines` directory.

## Using Astro Image Component 🖼️

When adding images to the website, please make sure to use astro Image component
and to specify the width of the image. This will make sure we are optimizing the
images and not serving large images to the users.

Here is an example:

```jsx
import { Image } from "astro:assset";

import image from "./image.jpg";

<Image src={image} width={500} />;
```
