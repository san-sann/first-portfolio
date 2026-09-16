# Euphoria — e-commerce storefront

**[Live site](https://euphoria-two-silk.vercel.app/)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/euphoria.html)**

Front-end build of a 21-page clothing store from a Figma Community design: product browsing, cart,
checkout, wishlist and account pages, with every interactive flow wired up in the browser.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | E-commerce storefront — 21 pages |
| Responsive | 320–1440px |
| Icons | 34 SVG icons in one generated sprite |
| Lighthouse | 77 · 96 · 100 · 91 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup, responsive layout and every interactive flow across all 21 pages — catalogue and product
detail, cart and empty-cart states, checkout and address forms, wishlist, order history and account
screens. Design is by the original Figma author (credited below); the build, layout, interaction and
accessibility work is mine. Backend, payments and real inventory are out of scope.

### State and data

State lives entirely in the browser, not on a server. A shared cart-state module backed by
`localStorage` drives the header badge, the cart page and a symmetric redirect to and from the
empty-cart state, syncing across tabs through the native `storage` event plus a custom event for
same-tab updates. Order history reads a static `orders.json` through a client-side fetch and renders
the list and detail pages from it. A deliberate boundary for a portfolio piece, not an oversight.

### Notable problems solved

**Build-time alias mutation.** A Vite plugin mutated a shared aliases object in place the first time
it processed a JS file importing from `@components`, permanently rewriting the alias to a broken path
for every request after. HTML includes resolved through that same object, so the pre-renderer started
failing silently and served raw, uncompiled markup instead of throwing. Fixed by resolving the
replacement into a local variable instead of mutating the shared config.

**Prod-only script truncation.** An inline script that mentioned a markup tag inside a comment got
parsed as HTML by the pre-renderer, not as script text — everything after the stray angle bracket was
silently dropped from the production build. The dev server served the script whole, so the bug only
surfaced in a production preview, where a feature quietly stopped running with zero console errors.

**Component CSS injected via JS templates.** Two pages rendered their button markup entirely from a
JS template. The build decides which component styles to bundle by scanning static HTML for data
attributes, so a button whose only markup lives inside a JS string never got its stylesheet injected
— it rendered unstyled, with no build or console errors. Fixed with an explicit stylesheet import in
each JS file that renders that markup.

### Built with

FLS 4 modules: Swiper sliders (product gallery with thumbnails, new-arrivals, reviews), popup,
spollers, tabs, select, range filter, rating, quantity stepper, showmore, form validation, watcher
reveals, scroll-aware header. Custom components: cart state, wishlist, account navigation, auth
header.

### Credits

Design — *Euphoria: Ecommerce (Apparels) Website Template* by Jhanvi Shah, Figma Community,
CC BY 4.0.
Development, layout, interaction and accessibility — mine.
