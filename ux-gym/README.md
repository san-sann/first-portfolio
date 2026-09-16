# UX Gym (Longread) — fullpage case-study guide

**[Live site](https://ux-gym.vercel.app/)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/longread.html)**

Front-end build of a long-form case-study guide from a Figma Community template: a six-slide fullpage
deck with keyboard and bullet navigation, scroll-snap transitions and a persistent chrome overlay.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | Fullpage case-study guide — 6 slides |
| Responsive | 320–1920px |
| Navigation | Keyboard, bullets and scroll, with a mobile fallback to normal document scroll |
| Lighthouse | 78 · 100 · 100 · 100 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup and responsive layout for the deck, the slide transitions, the persistent chrome overlay and
the navigation model on both tracks — fullpage on desktop, plain scroll on mobile. Design is by the
original Figma author (credited below); the build, layout, interaction and accessibility work is
mine. Content is a static guide: no backend, no dynamic data.

### State and data

There is no data layer here — the state is purely which slide is active. The fullpage module drives
that state and toggles a direction-aware class on the root element, which a shared chrome overlay
reads to show persistent brand and navigation controls above the current slide. Below tablet width
the module is destroyed entirely and the page falls back to normal document scroll — a deliberate
two-track experience, not a stripped-down mobile view.

### Notable problems solved

**Persistent chrome needs reserved space.** The brand tag and slide chrome used to live inside each
section's flex layout. Moving them into a shared fixed-position overlay removed them from that flow —
sections that relied on the chrome as a flex spacer lost their balance, and on narrow screens content
started running underneath it. Fixed by explicitly reserving the space the chrome used to occupy,
rather than putting the element back into the flow.

**A pseudo-class that silently never matched.** A persistent next button was meant to auto-hide on
the last slide via a `:last-child` selector. It never did: the fullpage module appends its own
bullet-navigation element after every section once it initialises, so no section is ever the last
child — only the last *of its type*. Switching to `:last-of-type` fixed it with zero JavaScript,
keyed off a class the module already toggles.

**Mobile fallback, not a mobile layout.** Below tablet width the fullpage module is destroyed at
runtime rather than styled around: the scroll-snap deck becomes a normal scrolling page, and slides
that relied on internal scrolling for overflow content revert to normal page scroll. Treating mobile
as a different navigation model, not a squeezed-down desktop one, avoids fighting assumptions built
into the module on small screens.

### Built with

FLS 4 modules: fullpage (with bullet navigation and direction-aware root classes), watcher reveals,
off-canvas menu. Custom component: slide chrome overlay (label, phase, progress, next control).

### Credits

Design — *UX Gym Blaze: Long Format Case Study Guide* by UX Anudeep, Figma Community, CC BY 4.0.
Development, layout, interaction and accessibility — mine.
