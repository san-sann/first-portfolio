# Internal Panel — admin dashboard

**[Live site](https://camioca-internal-panel.vercel.app/)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/internalpanel.html)**

Front-end build of a 22-page internal management tool from a Figma Community design system: tables,
filters, a date picker, pagination and every interactive state the design implies.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | Admin dashboard — 22 pages |
| Responsive | 320–1920px |
| Icons | 21 SVG icons in one generated sprite |
| Lighthouse | 82 · 88 · 100 · 100 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup, responsive layout and every interactive state across all 22 screens — data tables, filter
panels, a date picker, pagination, account and project pages. Design is by the original Figma author
(credited below); the build, layout, interaction and accessibility work is mine. Backend and real
data are out of scope.

### State and data

A static front-end build, not a connected admin tool: 22 standalone pages render fixed markup per
screen, with no client-side data layer or backend calls. Where the design implies state — date
picker, pagination, table sorting — it is handled locally in the DOM and the URL. A deliberate
boundary, not an oversight.

### Notable problems solved

**App-shell layout.** The sidebar and content had to live in their own nested wrapper with
`flex-direction: row` while the outer wrapper stayed a column — otherwise the footer collapsed into a
third sidebar column instead of sitting below the content. Invisible on a screenshot while the footer
is still empty, which is exactly why it is worth writing down.

**Accessible date picker.** An early version hid the focusable date input behind `aria-hidden`, which
breaks the `aria-hidden-focus` rule: an element that actually receives focus cannot be hidden from
assistive technology. Fixed by giving it a matching `aria-label` instead, so the control keeps both
its focus behaviour and a real accessible name.

**Cross-browser regression.** A full mobile WebKit pass, run through a custom Playwright-based QA
script rather than Chromium alone, caught layout drift that Chrome DevTools device mode did not show
— the difference between emulating a narrow window and rendering in the engine every iOS browser
actually uses.

### Built with

FLS 4 modules: spollers (single-open), tabs, select (including multi-select with tags), date picker,
pagination, checkbox and radio controls, rating, Swiper slider, password-visibility toggle, form
validation, off-canvas menu with an icon rail. Custom components: statistics chart, sub-navigation,
account menu.

### Credits

Design — *Admin Panel: Internal Management Tool* by Azamat Akhmadbaev, Figma Community, CC BY 4.0.
Development, layout, interaction and accessibility — mine.
