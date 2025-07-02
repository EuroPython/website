const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:4321/media/sponsors");

  const elements = await page.$$(".social");

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    // Get the slug from the element
    const slug = await page.evaluate((el) => el.getAttribute("data-slug"), el);

    // Fallback if slug is missing
    const filename = slug ? `social-${slug}.png` : `social-${i}.png`;

    await el.screenshot({ path: filename });
  }

  await browser.close();
})();
