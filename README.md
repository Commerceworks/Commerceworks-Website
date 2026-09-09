# Commerceworks

The Commerceworks UK/US website. Static, no build step, no dependencies.

Rebuilt 1 September 2026 from an archive of the previous Squarespace site
(`~/clawd/agents/virginia/commerceworks/`) after the domain went offline.
Content, images and contact details are the originals.

## Publishing

GitHub Pages publishes from **`main` / `docs`**, never from the repository root.
Anything outside `docs/` is not served over the web. Keep it that way: serving the
root makes every file in the repo a public URL the moment it is committed.
