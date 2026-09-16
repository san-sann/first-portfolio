# Real Estate — property listings platform

**[Live site](https://real-state-lime-two.vercel.app/)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/realstate.html)**

Front-end build of a 16-page property listings site from a Figma Community template: property search
with filters, property details, an agent directory, a blog and a full auth flow.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | Real estate listings platform — 16 pages |
| Responsive | 320–1440px, from dedicated desktop, tablet and mobile designs |
| Auth flow | Login → forgot password → OTP → new password |
| Lighthouse | 89 · 100 · 100 · 100 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup and responsive layout across all 16 pages, built from separate desktop, tablet and mobile
designs rather than one desktop frame scaled down. Design comes from a Figma Community template
(credited below); the build, layout, interaction and accessibility work is mine. Backend, real
listings data and real authentication are out of scope.

### State and data

No persisted state — no accounts, no saved searches, nothing carried across pages. The client-side
interactivity is a handful of local behaviours: a filter popup toggling form controls in a modal, a
client-side name filter on the agent list, and an auth flow — login through OTP verification to a new
password — that is purely presentational, with no real session behind it. Listings, agent profiles
and blog posts are static content assembled at build time. A deliberate boundary for a portfolio
piece, not a missing feature.

### Notable problems solved

**A hamburger that resisted becoming an X.** The menu icon is three lines of deliberately unequal
length — 12, 16 and 8 pixels, left-aligned — not a symmetric hamburger. Morphing them into an X would
have erased that asymmetry, so instead each line scales along its own x-axis to match the longest one
on toggle: the icon keeps its shape while still giving a clear state change. One trap along the way:
the button needed `position: relative` restored before its `z-index` took effect at all — without it
the icon sat silently behind the menu backdrop.

**A row-gap that needed a width ceiling, twice.** The nav list used one gap value for both axes,
which read fine in a single row but left an oversized vertical gap once items wrapped onto two lines
in the 769–992px range. Splitting it into a fixed column-gap and an adaptive row-gap fixed the axis
conflict, but the first pass still left 26–28px of gap through part of that range: the adaptive scale
stretches all the way down to the project minimum width, so the wrap zone landed only partway through
the interpolation. Pinning an explicit width ceiling on the scale — set to the exact width where
wrapping stops — closed the gap across the whole zone instead of just its edges.

**Colour labels that disagreed with their own swatch.** The Figma style guide listed Base and Primary
colour groups with a text label beside each swatch, apparently documenting its value. Checked against
the actual fills, those labels turned up flat contradictions — one Primary/90 swatch filled pale blue
with a yellow `rgba` label next to it, lifted from an unrelated palette. They were stale copy-paste
from a different template, not documentation. Every token was built from the real fill of the layer,
never from the text sitting next to it.

### Built with

FLS 4 modules: popup, range filter, select, tabs, Swiper slider, gallery, digit counter, form
validation with scroll-to-error, watcher reveals, off-canvas menu. Custom components: property card,
agent card, blog card, search bar, auth panel, testimonials, latest-news block.

### Credits

Design — *Real Estate Website Template* from Figma Community. The original source could not be
confirmed, so no author or license is claimed here rather than guessed at.
Development, layout, interaction and accessibility — mine.
