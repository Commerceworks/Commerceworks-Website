# Commerceworks — website rebuild

Work-in-progress rebuild of the Commerceworks site. **The live site is unaffected** — it
continues to run from `Commerceworks/Commerceworks` (GitHub Pages, `commerceworks.net`).
Nothing in this repo is deployed anywhere.

## What's here

| Path | What it is |
|---|---|
| `site/` | The site. The only directory that gets deployed |
| `DESIGN.md` | Design system, motion layer, share build and deployment notes |
| `build-share.py` | Builds the single self-contained preview file into `dist/` |
| `dist/` | The built preview. A build artefact — edit the sources, never this |

## No client data in this repo

**Deliberately.** No client names, no engagement values, no hours, no staff names, no rates.

The positioning below was derived from an analysis of the 2018–2026 time export, but that
analysis is *input* to the website, not source code for it. It lives with Virginia, outside
version control. This repo will be connected to a deployment platform and may be opened to a
designer or contractor, which is the wrong place for any of it.

**Do not add it back.** `.gitignore` blocks the obvious filenames, but that is a backstop,
not a policy. If you need the evidence behind a claim, ask Virginia.

The previous live site is not mirrored here either — it names clients on its case-study pages.
It is a browser tab away at `commerceworks.net` if you need to see what is being replaced.

## The brief

- **Sell depth of relationship, not a logo wall.** The firm's value is in engagements measured
  in years, not in the number of clients. The current live site sells implementation; the
  proposition should be *"we run this for you"*.
- **The bulk of the work is ongoing managed support and administration**, not implementation.
- **Lead with downstream oil & gas systems and connector work.** Salesforce is real and stays,
  but as a smaller section further down the page — the sharper edge is what happens *between*
  systems.
- **Capability areas**, in rough order of depth: managed support and administration; Power BI
  and reporting; custom Salesforce development; order management, contracts and invoicing;
  marketing automation; integration (SAP, BizTalk, Logic Apps, SFTP); CPQ and price books;
  GDPR and consent.
- **The domain-vocabulary section is the strongest differentiator** — BOL, COA, invoice point,
  incoterm, tank transfer, blended product, net premium, price band. Nobody generic can write
  that page. Keep it, and keep it quiet.

## Client references — currently none, on purpose

No client is named or described. The "How the work runs" section describes the *shape* of a
long engagement, not a particular one.

**Virginia decides who gets named and how.** Naming a client on a public site needs their
consent, and the name is worth considerably more than an anonymous description — so it is
worth asking for rather than working around. Until that decision is made, nothing goes in.

## Before this can go live

1. **Company number** — the footer says `[CONFIRM]`. The current live site publishes
   `16356123`, which belongs to a different company. Do not copy it across.
2. **Email and phone** — both are `REPLACE` placeholders.
3. **Remove the `X-Robots-Tag: noindex` header** from `vercel.json`, and turn Deployment
   Protection off. Both are there deliberately while this is a draft.
4. **Client naming** — see above.
