const puppeteer = require('puppeteer');

describe('Mobile nav focus trap', () => {
  let browser, page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });
  });

  afterAll(async () => {
    if (browser) await browser.close();
  });

  test('focus moves into menu, cycles with Tab, Escape closes and returns focus to toggle', async () => {
    await page.goto('http://localhost:8080/urbanThread/index.html', { waitUntil: 'networkidle0' });

    await page.waitForSelector('.nav-toggle', { visible: true });
    await page.click('.nav-toggle');

    await page.waitForSelector('#nav-menu.open', { visible: true });

    const aria = await page.$eval('.nav-toggle', el => el.getAttribute('aria-expanded'));
    expect(aria).toBe('true');

    // Get first focusable inside the menu
    const firstHtml = await page.evaluate(() => {
      const first = document.querySelector('#nav-menu a, #nav-menu button');
      return first ? first.outerHTML : null;
    });
    const activeHtml = await page.evaluate(() => document.activeElement.outerHTML);
    expect(activeHtml).toBe(firstHtml);

    // Count focusable items
    const focusableCount = await page.evaluate(() => document.querySelectorAll('#nav-menu a, #nav-menu button').length);

    // Tab through all focusables and verify it cycles back to the first
    for (let i = 0; i < focusableCount; i++) {
      await page.keyboard.press('Tab');
    }

    const afterTabActive = await page.evaluate(() => document.activeElement.outerHTML);
    expect(afterTabActive).toBe(firstHtml);

    // Press Escape to close
    await page.keyboard.press('Escape');

    // Menu should be closed
    const isOpen = await page.evaluate(() => document.querySelector('#nav-menu').classList.contains('open'));
    expect(isOpen).toBe(false);

    // Focus should be on the toggle
    const toggleHtml = await page.$eval('.nav-toggle', el => el.outerHTML);
    const newActive = await page.evaluate(() => document.activeElement.outerHTML);
    expect(newActive).toBe(toggleHtml);
  });
});