# Project Architecture — Urban Threads

This project uses a simple modular structure to separate data/services from UI logic.

Structure
- src/
  - services/  — data and persistence wrappers (firebaseAuth, productService, storage)
  - ui/        — UI modules for each page (login, signup, authState, navbar, products, cart, featured)
- data/        — static product data used for local development
- assets/      — images and media
- urbanThread/ — static HTML pages (index.html, shop.html, cart.html, login.html, signup.html)

Why this helps
- Clear separation helps students reason about single responsibilities
- Easier to write unit and integration tests against services

Notes
- All modules are ES modules and are loaded with `<script type="module">` from the pages.
- For production or later extension, consider bundling (esbuild/webpack) and moving logic into smaller components.