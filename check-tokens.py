#!/usr/bin/env python3
"""Enforce the house rule: no colour, size or radius literal outside tokens.css.

The rule is only worth having if something checks it. Run before committing CSS.
Exits non-zero and prints every offence.
"""
import re, sys, pathlib

CSS = pathlib.Path("site/css")
GUARDED = ["base.css", "components.css", "motion.css"]

CHECKS = [
    ("colour",  re.compile(r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)")),
    ("size",    re.compile(r"(?:font-size)\s*:\s*(?![^;}\n]*var\()[^;}\n]+")),
    ("radius",  re.compile(r"border-radius\s*:\s*(?![^;}\n]*var\()[^;}\n]+")),
    ("tracking",re.compile(r"letter-spacing\s*:\s*(?![^;}\n]*var\()[^;}\n]+")),
    ("shadow",  re.compile(r"box-shadow\s*:\s*(?![^;}\n]*var\()[^;}\n]+")),
]

fails = []
for name in GUARDED:
    f = CSS / name
    for lineno, line in enumerate(f.read_text().splitlines(), 1):
        if line.lstrip().startswith(("/*", "*")):
            continue
        code = line.split("/*")[0]
        for label, pat in CHECKS:
            for m in pat.finditer(code):
                if "var(--" in m.group(0):
                    continue
                fails.append((name, lineno, label, m.group(0).strip()))

if fails:
    print("Token rule violations — these belong in tokens.css:\n")
    for n, l, label, txt in fails:
        print("  %-16s :%-4d %-9s %s" % (n, l, label, txt[:70]))
    print("\n%d violation(s)." % len(fails))
    sys.exit(1)

print("tokens: clean — no colour, size, radius, tracking or shadow literal "
      "outside tokens.css across %d files" % len(GUARDED))
