# Xanix — creative agency landing page

**[Live site](https://xanix-iota.vercel.app)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/xanix.html)**

Front-end build of a single-page agency site from a Figma Community template: a hero, a scrolling
client-logo marquee, a services showcase with a mouse-parallax decor layer, a sliding works carousel,
a pricing table, a full-bleed testimonial slider, a FAQ accordion and a closing call to action.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | Single-page landing — 9 sections: hero, clients marquee, services, works, pricing, testimonials, FAQ, CTA, footer |
| Responsive | 320–1440px |
| Sliders | Two independently configured Swiper modules — a horizontal works slider and a full-bleed centred testimonial slider |
| Lighthouse | 88 · 100 · 100 · 100 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup and responsive layout for all nine sections, the two sliders, the marquee, the parallax decor
layer and the accordion. Design comes from a Figma Community template (credited below); the build,
layout, interaction and accessibility work is mine. Backend, a working contact form and CMS-driven
content are out of scope.

### State and data

No persisted state — no accounts, no saved preferences, nothing carried between visits. The
client-side interactivity is entirely local UI: a marquee scrolling the client-logo row, a
mouse-parallax layer behind the services list, two independently configured Swiper instances with
their own slide counts and loop settings, a single-open FAQ accordion, and scroll-to-section buttons.
Nothing here talks to a server. A deliberate boundary for a portfolio piece, not a missing feature.

### Notable problems solved

**A shared blurred wave that sits behind one section and in front of another.** The soft wave running
behind hero, clients and services comes from one Figma vector spanning all three, but every section
paints its own solid background — so placing the decor earlier in the DOM would have hidden it
instead of letting it show through. The fix inverts the stacking: the wave lives inside the services
section, later in the DOM, and draws on top of the clients background through a `z-index` reaching
back across the section boundary, with a `clip-path` cutting away the part that would spill up into
the hero. The SVG had to go inline rather than stay a `background-image`, which always clips to its
own box — and the replacement clip uses negative left and right insets, expanding the rectangle past
the box edges so the Gaussian blur fades to nothing instead of being cut off flush.

**One shared wave asset stitched across four sections.** Works, pricing, testimonials and FAQ share
the same decor. The first approach split it into four copies, one per section, each offset in pixels
— mathematically exact, confirmed by measurement, and still showing a visible seam at every boundary,
because each section clipped its own copy with its own `overflow: clip` and a blur is cut flush at
the edge of whatever clips it. Two independently clipped blurred edges never blend, however precise
the numbers. Fixed with a single shared wrapper around all four sections, one inline SVG sized to
100% of that wrapper's height — one blurred edge instead of four that have to line up.

**A full-bleed centred slider that changes its own success criteria.** The testimonial slider needed
to bleed to the viewport edges, centre its featured card and loop seamlessly. Two traps: first, a
flex item with `margin-inline: auto` does not stretch on the cross axis by specification — it shrinks
to its content and ignores any `max-width` meant as a ceiling, so the heading collapsed to the width
of its own text until both elements got an explicit `width: 100%`. Second, loop mode without a width
ceiling turns the number of real slides required into a moving target — every wider monitor needs
more, and Swiper only logs a warning rather than an error, so an error-only check stays green while
the loop quietly breaks. Capping the slider width and padding it out to sixteen real slides fixed
both at once.

### Built with

FLS 4 modules: two dedicated Swiper modules (works and testimonials), marquee with spacing and pause
controls, parallax with per-layer coefficients, spollers (single-open FAQ), rating, scroll-to,
scroll-aware header, watcher reveals, off-canvas menu with backdrop.

### Credits

Design — *Xanix Ageny: Agency Webflow Template* by Shazzade, Figma Community, CC BY 4.0.
Development, layout, interaction and accessibility — mine.
