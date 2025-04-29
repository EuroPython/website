const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:4321/media/social_media_cards");

  const elements = await page.$$(".social");

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    await el.screenshot({ path: `social-${i}.png` });
  }

  await browser.close();
})();
