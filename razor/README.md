# Razor — AI customer-service SaaS landing page

**[Live site](https://razor-orpin.vercel.app)** · **[Full case study](https://oleksandr-portfolio-olive.vercel.app/razor.html)**

Front-end build of a single-page product landing from a Figma Community template: a hero with a live
chat preview, a client-logo marquee, a feature walkthrough, an accordion of platform advantages, a
horizontally scrollable row of chatbot templates and a testimonial slider.

### What is in this folder

The production build — the files a browser actually receives. The source is kept in a private
repository: the project is built on the *Чертоги Фрілансера 4* Vite starter, whose license does not
allow redistributing the starter or parts of it. Everything the build contains — markup, compiled
CSS, JS — is here and readable.

### At a glance

| | |
|---|---|
| Type | Single-page landing — 7 sections: hero, companies marquee, about, advantage, templates, testimonials, CTA |
| Responsive | 320–1440px |
| Lighthouse | 96 · 100 · 100 · 100 &nbsp;*(performance · accessibility · best practices · SEO)* |
| Stack | Semantic HTML, SCSS (BEM), vanilla JS, Vite |

### Scope

Markup and responsive layout for all seven sections, plus the marquee, the scroll-snap template row
and a dedicated, independently configured testimonial slider. Design comes from a Figma Community
template (credited below); the build, layout, interaction and accessibility work is mine. Backend,
real chatbot behaviour and the account and billing flows are out of scope.

### State and data

No persisted state — no accounts, no saved chat history, nothing carried between visits. The
client-side interactivity is entirely local UI: a marquee scrolling the client-logo row, a
horizontally scrollable row of template cards using native scroll-snap, and one Swiper instance for
the testimonials. The chat widget in the advantage section is a static illustration, not a working
chatbot. A deliberate boundary for a portfolio piece, not a missing feature.

### Notable problems solved

**A text column losing a fight with a scroll container.** A heading column sits next to a
horizontally scrollable row of cards in the same flex row. The scroll container carried
`flex: 1 1 auto`, and `flex-basis: auto` measures that as the full intrinsic width of its content —
every card plus every gap — not as the space left over after the heading takes its share. The heading
was squeezed to a sliver, wrapping mid-word. Fixed with `flex-basis: 0` on the scroll container, so
its share comes purely from `flex-grow`, paired with a fixed basis and no grow on the heading column.

**One reusable notch shape, five different cards.** A concave corner-notch cut appears five times
across the layout — hero guide card, hero illustration, template card, testimonial bubble,
testimonial photo — each using `mask-image` with its own shape file. Rather than repeat the same
mask sizing, repeat and position rules five times, they share one SCSS placeholder that every
instance extends, leaving only the `mask-image` URL to vary. Convex corners on the same page stay
plain `border-radius`; masks are reserved for shapes a radius cannot express.

**A photo with two opposite bites at once.** The testimonial photo needed two independent step-cut
corners on opposite sides. A single mask can only carve one shape, so this layer stacks three: two
notch shapes plus a plain solid rectangle as a base. `mask-composite: exclude` on each notch removes
that corner from what came before it, while the base is added back with `add` — the two exclusions
carve both corners independently and the base keeps the rest of the rectangle intact.

### Built with

FLS 4 modules: marquee (with speed, spacing and pause controls), a dedicated Swiper module for
testimonials, mouse-parallax, watcher reveals, digit counter, scroll-to, scroll-aware header,
off-canvas menu with backdrop.

### Credits

Design — *Razor AI: AI Customer Service Tool* by Shahab Aslam Paracha, Figma Community, CC BY 4.0.
Development, layout, interaction and accessibility — mine.
