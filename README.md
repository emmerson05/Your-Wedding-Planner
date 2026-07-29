# Your Wedding Planner — Prototype

A clickable, installable web-app prototype (PWA). No backend yet — all data
lives in the browser's localStorage so you can click through the full flow.

## Screens included
- Landing (`index.html`)
- Create Account / Log In
- Welcome
- Onboarding (17-question wizard)
- Dashboard
- Budget
- Guests
- Suppliers
- Documents
- Settings

## Run it locally
Open `index.html` in a browser, or run a tiny local server:

    python3 -m http.server 8000

then visit http://localhost:8000

## Deploy for free on GitHub Pages
1. Create a new repo on GitHub (e.g. `your-wedding-planner`).
2. Push this folder to it:

       git add -A
       git commit -m "Prototype v1"
       git remote add origin https://github.com/<you>/your-wedding-planner.git
       git branch -M main
       git push -u origin main

3. In the repo: Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / root.
4. Your app will be live at `https://<you>.github.io/your-wedding-planner/`.
5. On a phone, open that URL in Chrome/Safari and use "Add to Home Screen" —
   it installs like a native app.

## Branding
Colors are placeholder (blush/gold) in `css/styles.css` (top `:root` block).
Once the logo photo is shared, swap `icons/icon-192.png` / `icon-512.png` and
update the CSS variables — everything else references those variables, so
it's a small change.
