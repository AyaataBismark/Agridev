# Agridev — Static Demo

This is a static, frontend-only demo of Agridev, a platform connecting local farmers with buyers. It contains HTML, CSS and JavaScript only — no backend.

Files:
- `index.html` — main page
- `css/styles.css` — styles
- `js/main.js` — client-side logic and sample data
- `assets/` — images (sample SVGs)

How to open:
1. Open `c:\Users\princ\Desktop\Agridev\index.html` in a browser (double-click or drag into browser).

Notes & next steps:
- This is a demo only; inquiries and contact messages are simulated with alerts.
- To make it production-ready: add image assets, host on static hosting (GitHub Pages, Netlify), and integrate a backend or API for listings and messaging.
- Consider adding pagination, sorting, user accounts, and localization.

Updates in this branch:
- Added several sample SVG images in `assets/` (mango, carrot, maize, tomato) and updated product entries to use them.
- Integrated Lunr.js for client-side full-text search. If Lunr fails to initialize, the site falls back to a simple substring search.
- Added a GitHub Actions workflow at `.github/workflows/deploy.yml` to publish the site to GitHub Pages on push to `main` or `master` using `peaceiris/actions-gh-pages`.

Publish to GitHub Pages (quick):
1. Create a repository on GitHub and push this project.
2. Ensure the default branch is `main` (or push to `master`) and the workflow will run on push.
3. The workflow uses the `GITHUB_TOKEN` to deploy; after the run succeeds your site will be published to `https://<your-username>.github.io/<repo-name>/`.

Notes:
- This workflow publishes the repository root — if you prefer a `docs/` folder, set `publish_dir` accordingly.
- The site references Lunr from a CDN (`https://cdn.jsdelivr.net/npm/lunr/lunr.min.js`). For fully offline usage you can download the script into `js/` and reference it locally.

Add real photographic images
--------------------------------
The demo ships with simple SVG illustrations by default. To use real photos of crops:

1. Create `assets/photos/` (already present).
2. Add photos named by slug: `mango.jpg` (or `mango.webp`), `carrot.jpg`, `maize.jpg`, `tomato.jpg`. WebP is preferred for smaller size.
3. Start a local server (recommended) so the site can check file existence, e.g.:

```powershell
cd 'c:\Users\princ\Desktop\Agridev'
python -m http.server 8000
# then open http://localhost:8000
```

4. The site will automatically use the photographic image if present; otherwise it falls back to the SVG.

Helper script:
- There's a helper script at `scripts/prepare-images.ps1`. Run it with the `-Source` folder where you downloaded photos. It will copy matching files (mango*, carrot*, maize*, tomato*) into `assets/photos/`. Use `-CreateWebP` if you have ImageMagick installed to also create compressed `.webp` versions.

Where to get photos:
- Use public-domain or permissively-licensed photos from sites like Unsplash, Pexels, or Wikimedia Commons. Always verify the license before use.

If you want, I can: add more real photographic images, convert this to a GitHub Pages-ready repo with a custom domain, or update deployment to use the new Pages deployments API steps instead of `peaceiris/actions-gh-pages`.
