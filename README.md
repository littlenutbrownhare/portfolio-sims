# Mafy Hidalgo — portfolio

A static portfolio site. Plain HTML, CSS, and JavaScript, no build step and no dependencies to install. It runs by opening the files in a browser and hosts on anything that serves static files.

## Pages

- `index.html` — home, with the live SEO audit counter, logo marquee, and stat cards
- `about.html` — bio and work timeline
- `skills.html` — skill groups and certificate frames
- `projects.html` — project cards (RollbackHQ, Logix WMS, Keyword Compass, and placeholders)
- `case-studies.html` — SEO results with working category filters
- `testimonials.html` — placeholder quote cards
- `contact.html` — contact form that opens your mail app pre-filled
- `village.html` — placeholder for the pixel-art "Village map" mode (see notes below)

## Running it locally

Because the pages load shared files (`assets/`), open them through a local server rather than double-clicking. From this folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Any static server works.

## Images

Every image frame is a click-to-upload slot. Click a frame (or drag an image onto it) and it saves to your browser's local storage, so your preview survives a refresh. This is a preview convenience only. For the real site, replace the slots with actual `<img>` tags pointing at files in an `assets/img/` folder, or keep the slot behaviour if you want an editable page.

Slots to fill: your headshot (home + about), a portrait (about), client logos (12 on home), certificate images (skills), project screenshots (projects), case-study screenshots, and testimonial headshots.

## Editing content

- Skills, projects, case studies, and testimonials are generated from small data arrays near the bottom of each page. Edit the array, and the cards update.
- The SEO audit logic lives in `assets/audit.js`. The numbers are deterministic per URL by design, so a given URL always produces the same demo report.
- The nav and footer year are injected by `assets/site.js`, so they stay consistent across pages.

## Deploying

Drop the whole folder onto any static host:

- **Netlify** — drag the folder into the Netlify dashboard, or connect a Git repo.
- **GitHub Pages** — push the folder to a repo and enable Pages.
- **Cloudflare Pages, Vercel, or your own server** — same idea, upload the folder.

No configuration needed. The one thing to know: two CDNs (Google Fonts and Simple Icons) load at runtime, so the host needs outbound internet, which every real host has.

## Notes

- The "Founder" line uses **Midnight Traffic** to match your resume.
- Project live links point at the real URLs from your CV (RollbackHQ, Logix WMS on Render, Keyword Compass). Tech Store Manager has no live link since it's a console app.
- The **Village map** is a full pixel-art game in the original Claude Design files (procedural map, pathfinding, day/night cycle, quests). It's a large separate build, so this pass ships a placeholder page. Ask if you want it built out.
