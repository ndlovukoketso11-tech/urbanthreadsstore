const puppeteer = require('puppeteer');

describe('Cart behavior', () => {
  let browser, page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });
  });

  afterAll(async () => {
    if (browser) await browser.close();
  });

  test('empty cart shows empty message and disabled checkout', async () => {
    await page.goto('http://localhost:8080/urbanThread/cart.html', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.setItem('cart', JSON.stringify([])));
    await page.reload({ waitUntil: 'networkidle0' });

    const emptyVisible = await page.$eval('#empty-message', el => getComputedStyle(el).display !== 'none');
    expect(emptyVisible).toBe(true);

    const checkoutDisabled = await page.$eval('#checkoutBtn', el => el.disabled);
    expect(checkoutDisabled).toBe(true);

    const total = await page.$eval('#total', el => el.textContent.trim());
    expect(total).toBe('Total: R0.00');
  });

  test('cart renders items and totals correctly', async () => {
    const testCart = [
      { id: 1, name: 'Classic Tee', price: 24.00, qty: 1 },
      { id: 2, name: 'Cozy Hoodie', price: 49.00, qty: 2 }
    ];

    await page.evaluate((c) => localStorage.setItem('cart', JSON.stringify(c)), testCart);
    await page.goto('http://localhost:8080/urbanThread/cart.html', { waitUntil: 'networkidle0' });

    const rows = await page.$$eval('#cartItems tr', rows => rows.length);
    expect(rows).toBe(2);

    const total = await page.$eval('#total', el => el.textContent.trim());
    expect(total).toBe('Total: R122.00');
  });

  test('increment/decrement qty updates totals and persists', async () => {
    // Start with known cart state
    const testCart = [ { id: 1, name: 'Classic Tee', price: 24.00, qty: 1 } ];
    await page.evaluate((c) => localStorage.setItem('cart', JSON.stringify(c)), testCart);
    await page.goto('http://localhost:8080/urbanThread/cart.html', { waitUntil: 'networkidle0' });

    // Click increase
    await page.click('.qty-increase');
    await page.waitForTimeout(200);

    const qty = await page.$eval('.qty', el => el.textContent.trim());
    expect(qty).toBe('2');

    const total = await page.$eval('#total', el => el.textContent.trim());
    expect(total).toBe('Total: R48.00');

    // Click decrease
    await page.click('.qty-decrease');
    await page.waitForTimeout(200);

    const qty2 = await page.$eval('.qty', el => el.textContent.trim());
    expect(qty2).toBe('1');

    const total2 = await page.$eval('#total', el => el.textContent.trim());
    expect(total2).toBe('Total: R24.00');

    // Check localStorage persisted
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('cart')));
    expect(stored[0].qty).toBe(1);
  });

  test('remove item updates cart and shows empty state when last removed', async () => {
    const testCart = [ { id: 1, name: 'Classic Tee', price: 24.00, qty: 1 } ];
    await page.evaluate((c) => localStorage.setItem('cart', JSON.stringify(c)), testCart);
    await page.goto('http://localhost:8080/urbanThread/cart.html', { waitUntil: 'networkidle0' });

    await page.click('.remove-item');
    await page.waitForTimeout(200);

    const rows = await page.$$eval('#cartItems tr', rows => rows.length);
    expect(rows).toBe(0);

    const emptyVisible = await page.$eval('#empty-message', el => getComputedStyle(el).display !== 'none');
    expect(emptyVisible).toBe(true);

    const checkoutDisabled = await page.$eval('#checkoutBtn', el => el.disabled);
    expect(checkoutDisabled).toBe(true);
  });
});