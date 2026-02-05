const puppeteer = require('puppeteer');

describe('Auth announcements', () => {
  let browser, page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });
  });

  afterAll(async () => {
    if (browser) await browser.close();
  });

  test('login sets auth-status and updates nav, then clears after timeout', async () => {
    await page.goto('http://localhost:8080/urbanThread/index.html', { waitUntil: 'networkidle0' });

    // Simulate login
    await page.evaluate(() => {
      if (window.__handleAuthState) window.__handleAuthState({ email: 'test@example.com' });
    });

    // auth-status text should be present immediately
    const statusText = await page.$eval('#auth-status', el => el.textContent);
    expect(statusText).toBe('Logged in as test@example.com');

    // nav should show user email and logout
    const authHTML = await page.$eval('#auth-link', el => el.innerHTML);
    expect(authHTML).toContain('test@example.com');
    expect(authHTML).toContain('Logout');

    // wait for message to clear (3s + small buffer)
    await page.waitForTimeout(3500);
    const cleared = await page.$eval('#auth-status', el => el.textContent);
    expect(cleared).toBe('');
  });

  test('logout sets auth-status message and nav shows Login', async () => {
    await page.goto('http://localhost:8080/urbanThread/index.html', { waitUntil: 'networkidle0' });

    // Simulate logout
    await page.evaluate(() => {
      if (window.__handleAuthState) window.__handleAuthState(null);
    });

    const statusText = await page.$eval('#auth-status', el => el.textContent);
    expect(statusText).toBe('You are logged out');

    const authHTML = await page.$eval('#auth-link', el => el.innerHTML);
    expect(authHTML).toContain('Login');

    await page.waitForTimeout(3500);
    const cleared = await page.$eval('#auth-status', el => el.textContent);
    expect(cleared).toBe('');
  });
});