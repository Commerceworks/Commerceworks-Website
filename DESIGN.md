# Design notes — yellow / white

## Why it doesn't look like the ByzGen house style

The house system in `house-style.md` is navy `#07111f` with electric cyan. This page keeps
**the whole structural system** and swaps only the palette:

- **Manrope only**, 400–800 — unchanged
- **The fluid `clamp()` scale** for hero / page / sub / small — unchanged
- **The tracking signature** — `-.055em` on the hero, `-.04em` on heads, `+.14em` on small
  uppercase labels. This is the thing that makes it read as ours rather than as a template
- **1320px container, 720–900px prose measure, 8–22px radii, 999px pills** — unchanged
- **One big soft shadow**, never many small ones — unchanged

## What changed

**The ink is a warm near-black (`#14120c`), not navy.** This is the single most important
decision on the page. Yellow against navy is a hazard sign — road works, hi-vis, warning
labels. Yellow against a warm charcoal on a warm white is daylight. Same accent, completely
different temperature.

**Yellow does three separate jobs and the token names say which:**

| Token | Value | Job |
|---|---|---|
| `--yellow` | `#ffd100` | Fills and rules **only**. It fails text contrast on white and that is deliberate |
| `--amber` | `#a07400` | The same hue made legible. Text, links, numerals |
| `--wash` | `rgba(255,209,0,.14)` | The one soft bloom behind the hero |

Using the bright yellow for text is the mistake that makes yellow brands look cheap. The
token split makes it hard to do by accident.

## Restraint, per the standing rule

Virginia, 25 Aug: *"you know me — i hate things in my face — things need to be subtle always."*

- **Two saturated yellow surfaces on the whole page** — the CTA panel and the primary button.
  Everything else is a hairline, a 2px left rule, a 3px label dash or a 9px dot.
- **The marker on "data"** sits behind the word at 42% height, so the ink stays fully legible.
  Colour in the text, not a block around it.
- **The vocabulary section is just text and hairlines.** No cards, no icons, no fills. It is
  the most persuasive section on the page and it shouts least.
- One accent per section. If a section needs two, the section is doing too much.

## Type scale

Every `font-size` in the build resolves to one of these. The first cut of this page had
**fourteen** ad-hoc sizes between 11.5 and 26px, which is drift rather than a scale; near
duplicates (15 and 15.5, 13 and 13.5, 14 and 14.5) have been collapsed onto one step each.

| Token | Value | Used for |
|---|---|---|
| `--t-hero` | `clamp(50px, 5.7vw, 88px)` | Hero only |
| `--t-page` | `clamp(42px, 5vw, 70px)` | Section heads |
| `--t-sub` | `clamp(25px, 3vw, 42px)` | Sub-heads, pull quotes |
| `--t-small` | `clamp(24px, 2.8vw, 40px)` | Small heads |
| `--t-stat` | `clamp(30px, 3.2vw, 44px)` | Proof-strip numerals |
| `--t-lead` | `clamp(18px, 1.5vw, 22px)` | Lead paragraphs |
| `--t-lg` | 26px | Stat numerals in the aside |
| `--t-md` | 20px | h4, brand wordmark |
| `--t-base` | 17px | Body |
| `--t-base-s` | 16px | Body below 640px |
| `--t-sm` | 15px | Card body, marquee, list detail |
| `--t-s` | 14px | Nav, footer links |
| `--t-xs` | 13px | Captions |
| `--t-2xs` | 11.5px | Uppercase labels, pills |

The four `clamp()` values are the house ones, unchanged.

## Tracking

Five tokens, down from ten ad-hoc values. Tracking is the signature of this typographic
system and it is the thing that most obviously goes wrong when it is set by feel.

| Token | Value | Used for |
|---|---|---|
| `--tr-hero` | `-.055em` | Hero only |
| `--tr-head` | `-.04em` | Section heads, large numerals |
| `--tr-tight` | `-.02em` | Mid-size UI type: brand, node labels, buttons |
| `--tr-label` | `+.14em` | Small uppercase labels |
| `--tr-label2` | `+.13em` | The tighter of the two house label values |
| `--tr-wider` | `+.24em` | Hover-expanded labels only |

## Enforcing the rule

```
python3 check-tokens.py
```

The house rule — *no colour, size, radius, tracking or shadow literal outside `tokens.css`* —
is only worth having if something checks it. This script does, across `base.css`,
`components.css` and `motion.css`, and exits non-zero listing every offence.

It found two violations the manual pass missed on its first run (`rgba(20,18,12,.28)` and a
stray `12.5px`), which is the argument for having it. **Run it before committing CSS.**

## Open items before this can go live

1. **Company number** — the footer says `[CONFIRM]`. The current live site publishes
   `16356123`, which belongs to a different company. Do not copy it across.
2. **Client naming** — the work section describes "a global fuels and lubricants marketer"
   rather than naming them. Naming a client on a public site needs their consent, and it is
   worth getting because the name is worth more than the description.
3. **Email and phone** — both are `REPLACE` placeholders in the CTA.
4. **The numbers** are from the cleaned time log (see `docs/client-work-breakdown.md`).
   They are defensible but they are rounded down, not up. Check you are happy publishing
   hour counts at all — competitors can read them too.

---

# Motion layer (branch `design/oil-gas-fancy`)

Added on request: *"I want fancy — rolling banners, popping pills and the whole works."*

## What moves

| Element | Behaviour |
|---|---|
| **Rolling banner ×2** | Infinite marquees. The first, on white under the hero, carries the domain vocabulary (BOL, COA, invoice point, incoterm EXW…). The second, on ink, runs the **opposite way** with the tech stack. Both pause on hover and are masked to fade at both edges rather than being cut off |
| **The pipeline** | The showpiece. Five nodes — Terminal → Interface → ERP/SAP → Operations → Invoice — with four yellow dots flowing along the line on a staggered loop. It is the proposition drawn as a picture |
| **Popping pills** | Spring easing (`cubic-bezier(.34,1.56,.64,1)`), lift and fill yellow on hover, and enter in a stagger 45ms apart. The Salesforce cloud bobs gently on an offset loop |
| **Counting numerals** | 9 / 55,000 / 8,900 / 47 count up on easeOutCubic when scrolled into view, tabular figures so nothing jitters |
| **Scroll reveal** | Sections rise 26px and fade in, staggered by up to 320ms |
| **The marker** | The yellow behind "data" wipes in left to right on load rather than being there from the start |
| **Cards** | Lift 4px, a yellow rule sweeps across the top, and the section numeral opens its tracking |
| **Nav** | Shrinks 70px → 58px on scroll, links get a yellow underline that grows from the left, the brand dot springs on hover |
| **Buttons** | A soft glow that follows the cursor, and the arrow slides on hover |
| **Vocabulary rows** | Indent and turn amber on hover — the quiet section stays quiet but is no longer dead |

## Two things that keep this professional rather than gaudy

**1. `prefers-reduced-motion` is honoured properly.** One media query kills every animation
and transition. Roughly a third of users have it on at some point, and for anyone with
vestibular sensitivity a page like this is genuinely unpleasant without it.

**2. Nothing important depends on JavaScript.** An inline script swaps `no-js` for `js` on
`<html>` before the first paint, and the hidden-until-revealed state only applies under `.js`.
If `motion.js` fails to load, everything is simply visible. The marquee duplicate set is in
the markup rather than cloned by JS, so the loop stays seamless too.

Everything above is decoration on a page that already worked. That is the order it should
be built in.

---

# Sharing it

## Single-file build

```
python3 build-share.py     ->  dist/commerceworks-preview.html
```

Inlines all three stylesheets, the motion script and **the Manrope font itself**
(the two latin subsets, base64, SIL OFL 1.1 permits embedding). The result makes
**zero network requests** — verified by rendering it with all DNS blackholed and
diffing against the served version: pixel-identical.

That matters because the alternative silently degrades. A file linking to Google Fonts
looks perfect on your machine and falls back to Arial on a train, in an email preview
pane, or on a locked-down corporate laptop — which is exactly where a prospect opens it.

The build adds two things the repo version does not have:
- `<meta name="robots" content="noindex,nofollow">`
- a dismissable **"Draft preview · not the live site"** ribbon, bottom left

Rebuild it after any change to `index.html`, the CSS or the JS. It is a build artefact,
not a source file — edit the sources, never `dist/`.

## If it needs a URL rather than a file

A link is better than an attachment for anything going to a client, but it is a
publishing decision, not a technical one. Three routes:

| Route | Good for | Cost |
|---|---|---|
| **Vercel preview** on the repo | A private-ish link per branch, updates on push, password option on paid | Free tier fine |
| **Cloudflare Pages** | Same, and can sit behind Cloudflare Access so only named emails get in | Free |
| **GitHub Pages** | Simplest, but the repo is private so Pages needs a paid plan, and it would be fully public | Paid |

**Nothing should get a public URL until the placeholders are resolved** — company number,
client naming consent, and real contact details. A draft with `[CONFIRM]` in the footer
is fine as an attachment to someone who knows it is a draft. It is not fine on an
indexable URL.

---

# Deployment — Vercel

Commerceworks stands alone: **its own Vercel account**, not shared with IOW infrastructure.
That is deliberate. It keeps ownership clean, and it means a preview can be shared with
someone outside the group without giving them a door into anything else.

## Repo layout, and why

```
site/            <- the ONLY directory served (outputDirectory: "site")
  index.html
  css/  js/  assets/
dist/            <- the single-file share build. Not served.
```

A static project serves the repository root by default. `outputDirectory` narrows that to
`site/`, so nothing above it can reach a public URL. This repo previously held client billed
amounts and staff rates; they are gone, and the structure is arranged so a careless
`git add` cannot put them back on the internet.

## Connecting it

1. **Create the Vercel account** for Commerceworks and sign in.
2. **Add New → Project → Import Git Repository.** `Commerceworks` will not be listed until
   you click **Adjust GitHub App Permissions** and grant the new Vercel account access to
   the **Commerceworks** organisation.
3. Import **`cw-new-site`**. **Framework Preset: Other.** Leave build and install commands
   empty — `vercel.json` sets them.
4. Production branch is `main`, which is the default. Nothing to change.

Every push to `main` updates production; every branch gets its own preview URL.

## Sharing it with someone outside the group

**Project → Settings → Deployment Protection → Vercel Authentication.** Available on every
plan including Hobby, and it is Vercel's recommended method. With it on, only people signed
in to the account can open the URL.

To show it to someone who has no Vercel account, use a **Shareable Link** — a signed URL
generated per deployment from **Deployments → the deployment → ⋯ → Share**. The recipient
needs no account and gets no access to anything else.

> **The Hobby limit that matters:** on the free plan an account can have **one shareable
> link in total**. One link can go to several people, but you cannot hold a different link
> per audience without upgrading to Pro. Worth knowing before the account is created rather
> than when a second client asks.

## `vercel.json`

Sets `outputDirectory`, no build step, `cleanUrls`, security headers, cache policy, and
`X-Robots-Tag: noindex, nofollow`.

> **Remove the `X-Robots-Tag` header at go-live**, and turn Deployment Protection off.
> A leftover noindex is a very quiet way to stay invisible on Google for months.

## Why not Cloudflare

Briefly considered, and the config existed on 5 Sep before Commerceworks was decided to be
standalone. The Cloudflare account available was shared with other ventures, and protecting
a `pages.dev` deployment for an outside viewer is awkward: Access is account-scoped, so
letting one external person in means adding them to that account's Access policy.

Vercel's shareable links solve exactly that case, and a separate account keeps Commerceworks'
hosting independent of anyone else's.

