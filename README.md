# Video Editing Portfolio

A cinematic, single-page portfolio for **Burnekboi**, showcasing the edited work from *The Last Human Heir* universe. Live at **[burnekboi.github.io/video-editing-portfolio](https://burnekboi.github.io/video-editing-portfolio/)**.

## What's here

- `index.html` — the portfolio site: hero, featured work, searchable/filterable video gallery, process, characters, skills, résumé preview and contact.
- `resume.html` — a clean, print-ready résumé (use **Print / Save as PDF**).
- `RESUME.md` — the same résumé in Markdown.
- `assets/data/videos.json` — generated catalogue of all 142 videos: titles, categories, durations, resolutions, file sizes and stream URLs.
- `assets/posters/` — 142 thumbnails extracted from the source videos.
- `assets/art/` — hero art, character references and editing-workspace snapshots.
- `assets/css/style.css`, `assets/js/app.js` — styling and gallery/player logic.

The videos themselves live in a separate repository, **[last-human-heir-media](https://github.com/Burnekboi/last-human-heir-media)**, because GitHub Pages cannot serve Git LFS objects. The gallery streams videos directly from that repository.

## Before you publish

The résumé and contact details use clearly marked placeholders. Search the site for `[YOUR` and replace:

- `[YOUR NAME]` — your full name (appears in the page title, hero, résumé and footer)
- `[EMAIL]`, `[PHONE]`, `[LOCATION]`
- `[LINKEDIN URL]`, `[PORTFOLIO URL]`
- `[JOB TITLE]`, `[PREVIOUS ROLE / FREELANCE CLIENT]`, `[COMPANY OR CLIENT]`, `[START]`, `[END]`, `[DATES]`
- `[DEGREE]`, `[UNIVERSITY]`, `[YEAR]`, `[CERTIFICATION]`, `[INSTITUTION]`
- `[LANGUAGE]`, `[FLUENCY]`

Also review the "Tools" section and experience bullets — they were written from the project files and should be confirmed before sending the résumé to employers.

## Updating the catalogue

The media repo holds the videos. `assets/data/videos.json` is generated from them with `ffprobe` (metadata) and `ffmpeg` (thumbnails). If you add or rename videos, regenerate that file and the posters, then commit the changes here.

## Deployment

Published with GitHub Pages from the `main` branch, `/` (root) folder. Any push to `main` updates the live site within a minute or two.
