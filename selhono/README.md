# Selhono — interior design and architecture studio

**[Live site](https://selhono-ten.vercel.app/)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/selhono.html)**

Front-end build of a 14-page studio site from a Figma Community template: services, a filterable
project portfolio, team profiles, pricing, a blog and contact.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | Interior design and architecture studio — 14 pages |
| Responsive | 320–1440px, from dedicated desktop, tablet and mobile designs |
| Lighthouse | 92 · 100 · 100 · 91 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup and responsive layout across all 14 pages, built from separate desktop, tablet and mobile
designs rather than one desktop frame scaled down. Design is by the original Figma author (credited
below); the build, layout, interaction and accessibility work is mine. Backend, CMS and real
booking or inventory data are out of scope.

### State and data

No app-wide state — no cart, no accounts, nothing persisted across pages. The one piece of
client-side interactivity is the project gallery: a category filter toggles a `hidden` attribute on
cards entirely in the browser, with no re-render or fetch involved. Team bios, FAQs, blog listings
and pricing are static content assembled at build time. A deliberate boundary for a portfolio piece,
not a missing feature.

### Notable problems solved

**A filter that looked broken but was a cascade fight.** The gallery hid non-matching cards with a
`hidden` attribute, paired with a base rule that made shown cards `flex`. It passed testing with one
category enabled; turning on the rest revealed every hidden card still visible. The obvious fix — a
`:not([hidden])` selector — never had a chance: a separate rule in the reset stylesheet set `display`
on the bare anchor tag itself, and it kept winning once the hidden-state selector stopped matching.
Fixed with an explicit `[hidden]` rule at the same specificity as the shown-state rule.

**A max-width three flex levels away from where it mattered.** A centred call-to-action block was
nested three flex levels deep, each level using centre alignment instead of stretch. A `max-width` on
the outermost wrapper looked like it should cap the whole block, but a long unbreakable string pushed
past it anyway: every intermediate level defaults to a minimum width based on its own content, and
centre-aligned flex items never override that default the way stretched ones do. Fixed by adding an
explicit `min-width: 0` at every intermediate level, not just on the text node.

**An overflow bug invisible to the overflow check.** A hero section set `flex-start` alignment on its
column to stop one button stretching full-width — but that resets the cross-axis sizing of *every*
child, not just the targeted one. The heading shrank to its own content instead of the parent width,
and a long word rendered past the visual edge. No scrollbar ever appeared, because the section
clipped its own overflow silently, leaving nothing for an automated width check to measure. Fixed by
leaving container alignment at its default and overriding only the child that needed it.

### Built with

FLS 4 modules: popup (including YouTube embeds), gallery, marquee, spollers (single-open), Swiper
slider, digit counter, checkbox controls, form validation with scroll-to-error, watcher reveals,
off-canvas menu. Custom components: project card, team card, service item, blog card, testimonial,
contact info, page intro, search box, counter.

### Credits

Design — *SELHONO Design Website Template* by Azizbek Aliyev, Figma Community, CC BY 4.0.
Development, layout, interaction and accessibility — mine.
