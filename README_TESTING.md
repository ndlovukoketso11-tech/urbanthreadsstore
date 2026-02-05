# Running headless tests

This project includes a Puppeteer/Jest test to validate the mobile navigation focus trap and basic open/close behavior.

Steps to run locally:

1. Install dev dependencies:

   npm install

2. Run the tests (this will start a small static server at http://localhost:8080):

   npm test

Notes:
- Tests open a headless Chromium; if your environment blocks headless browsers (e.g., CI with missing libs), see Puppeteer troubleshooting docs.
- The test assumes your site is served from `urbanThread/index.html` at the server root (http://localhost:8080/urbanThread/index.html).

Demo accounts (seeded on first run):
- student1@example.com / password123
- student2@example.com / password123

These can be used for manual testing of login/logout and protected pages.
