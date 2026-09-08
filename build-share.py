#!/usr/bin/env python3
"""Build a single self-contained HTML file.

Inlines every stylesheet and script so the result is one file that can be
emailed, opened from a Downloads folder or dropped on a colleague's desktop
with no server, no build step and no missing assets.
"""
import re, pathlib, sys, datetime, base64

root = pathlib.Path(__file__).parent
src  = root / "site" / "index.html"
out  = root / "dist" / "commerceworks-preview.html"
out.parent.mkdir(exist_ok=True)

html = src.read_text()

def inline_css(m):
    href = m.group(1)
    if href.startswith("http"):
        return m.group(0)                      # leave the font CDN alone
    css = (root / "site" / href).read_text()
    return "<style>\n/* ---- %s ---- */\n%s\n</style>" % (href, css)

def inline_js(m):
    src_attr = m.group(1)
    if src_attr.startswith("http"):
        return m.group(0)
    js = (root / "site" / src_attr).read_text()
    return "<script>\n/* ---- %s ---- */\n%s\n</script>" % (src_attr, js)

def font_face():
    """Embed the two latin Manrope subsets so the file needs no network at all.
    Manrope is SIL Open Font Licence 1.1, which permits embedding."""
    subsets = [
        ("xn7gYHE41ni1AdIRggexSg.woff2",
         "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
         "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
         "U+2212,U+2215,U+FEFF,U+FFFD"),
        ("xn7gYHE41ni1AdIRggmxSuXd.woff2",
         "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,"
         "U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,"
         "U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"),
    ]
    faces = []
    for fname, urange in subsets:
        data = (root / "site" / "assets" / fname).read_bytes()
        b64 = base64.b64encode(data).decode()
        faces.append(
            "@font-face{font-family:'Manrope';font-style:normal;"
            "font-weight:200 800;font-display:swap;"
            "src:url(data:font/woff2;base64,%s) format('woff2');"
            "unicode-range:%s}" % (b64, urange))
    return ("<style>\n/* Manrope, SIL OFL 1.1, embedded so this file works offline */\n"
            + "\n".join(faces) + "\n</style>")

# drop the Google Fonts links and the preconnects entirely
html = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', html)
html = re.sub(r'<link href="https://fonts\.googleapis[^>]*>', font_face(), html)

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)
html = re.sub(r'<script src="([^"]+)"[^>]*></script>', inline_js, html)

stamp = datetime.date.today().isoformat()
html = html.replace("</head>",
  '<meta name="robots" content="noindex,nofollow">\n'
  '<!-- Self-contained preview built %s from branch design/oil-gas-fancy.\n'
  '     Draft. Company number, client naming and contact details are placeholders. -->\n'
  '</head>' % stamp)

# a small unobtrusive draft ribbon, so nobody mistakes this for the live site
html = html.replace("</body>", """
<div id="draftnote" style="position:fixed;left:16px;bottom:16px;z-index:999;
  background:#14120c;color:#fff;font:600 12px/1.4 Manrope,system-ui,sans-serif;
  letter-spacing:.02em;padding:9px 13px;border-radius:999px;
  box-shadow:0 6px 24px rgba(20,18,12,.28);display:flex;gap:9px;align-items:center">
  <span style="width:7px;height:7px;border-radius:50%;background:#ffd100"></span>
  Draft preview &middot; not the live site
  <button onclick="this.parentNode.remove()" aria-label="Dismiss"
    style="all:unset;cursor:pointer;opacity:.5;padding-left:4px">&times;</button>
</div>
</body>""")

out.write_text(html)
kb = out.stat().st_size / 1024
assert 'href="css/' not in html and 'src="js/' not in html, "an asset was not inlined"
assert 'fonts.googleapis' not in html and 'fonts.gstatic' not in html, "font not embedded"
print("wrote %s  (%.0f KB, %d lines)" % (out, kb, html.count("\n")))
