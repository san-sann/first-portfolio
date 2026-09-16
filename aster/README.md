# Aster — news analytics dashboard

**[Live site](https://aster-nu.vercel.app)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/aster.html)**

Front-end build of a news analytics dashboard from a Figma Community template: an app-shell
interface with a persistent side rail, a search-and-profile toolbar, a filterable news feed and a
right-hand column of widgets, plus a full article reading page with comments.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | News analytics dashboard — 2 primary pages + privacy and terms |
| Responsive | 320–1440px |
| Lighthouse | 91 · 90 · 100 · 100 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup and responsive layout for the whole interface: side rail, toolbar, news feed with a topic
filter, widgets column, and the article page with its comment thread. Design comes from a Figma
Community template (credited below); the build, layout, interaction and accessibility work is mine.
Backend, real article data and authentication are out of scope.

### State and data

No persisted state — no accounts, no saved articles carried between pages. The client-side
interactivity is local UI only: a topic-filter tab bar on the feed, a comment thread that expands in
place, and widgets (weather, quick bytes, newsletter) rendered as static content assembled at build
time. A deliberate boundary for a portfolio piece, not a missing feature.

### Notable problems solved

**Triaging a three-part toolbar into one mobile bar.** The toolbar (search, a secondary promo pill,
profile) is a separate component from the side rail, so neither has to know about the other. Below
the mobile breakpoint a single row cannot hold all three, so each element is triaged by importance
rather than shrunk uniformly: search collapses to an icon that expands into a full-width overlay
input, the promo pill — the weakest candidate — drops into the off-canvas panel, and the profile
control reduces to the avatar. The rail's burger toggle merges into that same row instead of
stacking as a second sticky bar.

**A texture layer that diluted its own background colour.** Several panels combine a solid brand
colour with a faint texture on top. Putting both the colour and the opacity on one element composites
them together *before* that layer meets the page behind it, so the panel read as a washed-out tint
instead of the flat, saturated colour in the design. Fixed by splitting the layer in two: the solid
colour stays on the parent at full opacity, the texture moves to its own absolutely positioned child
with its own opacity — the fade now only ever touches the texture.

**Two fixed panels standing in for one off-canvas menu.** The mobile panel had to show content owned
by two different components, and nesting one component's markup inside another is not allowed in this
build. The fix is two independent `position: fixed` siblings reading the same open-state attribute
and the same transition, so they read as one panel. The first attempt sized the top panel to
`100svh` minus the measured height of the bottom one — that number drifted between a headless test, a
zoomed DevTools emulation and a real phone with a collapsing toolbar. Dropping the subtraction fixed
it for good: one plain full-height layer with an overlay on top beats two numbers that must add up.

### Built with

FLS 4 modules: tabs, spollers, showmore, Swiper slider, scroll-to, off-canvas menu, form validation.
Custom components: toolbar, widgets column, news card, top-stories list, article page, legal pages.

### Credits

Design — *Aster News Dashboard Template* from Figma Community, CC BY 4.0.
Development, layout, interaction and accessibility — mine.
