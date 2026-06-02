const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:4321/media/speakers", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // Wait for all images to finish loading (both <img> and SVG <image> elements)
  await page.evaluate(() =>
    Promise.all([
      // HTML img elements
      ...Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            })
        ),
      // SVG <image> elements loaded via href
      ...Array.from(document.querySelectorAll("svg image[href]")).map(
        (svgImg) =>
          new Promise((resolve) => {
            const url = svgImg.getAttribute("href");
            if (!url) return resolve();
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
          })
      ),
    ])
  );

  // Hide the Astro dev toolbar and any other overlays before screenshotting
  await page.addStyleTag({
    content: `
      astro-dev-toolbar,
      astro-dev-toolbar-window,
      [data-astro-dev-toolbar],
      #astro-dev-toolbar { display: none !important; }
    `,
  });

  // Unwrap .social divs from their <a> parent to prevent the browser's
  // link toolbar overlay from appearing in screenshots
  await page.evaluate(() => {
    document.querySelectorAll("a > .social").forEach((el) => {
      el.parentElement.replaceWith(el);
    });
  });

  // Move mouse away from any element to avoid hover states
  await page.mouse.move(0, 0);

  const elements = await page.$$(".social");

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    // Get the slug from the element
    const slug = await page.evaluate((el) => el.getAttribute("data-slug"), el);

    // Fallback if slug is missing
    const filename = slug ? `social-${slug}.png` : `social-${i}.png`;

    await el.screenshot({ path: filename });
    console.log(`Saved ${filename}`);
  }

  console.log(`Done. ${elements.length} cards generated.`);
  await browser.close();
})();
