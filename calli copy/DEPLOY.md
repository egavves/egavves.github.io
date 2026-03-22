# Deploying to GitHub Pages

## What's in this folder

| File | URL after deploy |
|------|-----------------|
| `index.html` | `https://egavves.github.io/dashboards/` |
| `calli_feature_vault_v2.html` | `https://egavves.github.io/dashboards/calli_feature_vault_v2.html` |
| `feature_distributions.html` | `https://egavves.github.io/dashboards/feature_distributions.html` |
| `cut_feature_dashboard.html` | `https://egavves.github.io/dashboards/cut_feature_dashboard.html` |

All files are fully self-contained — no server needed, no build step.

---

## Deployment steps

### 1. Copy this folder into your repo

```bash
cp -r /path/to/dashboards  /Users/egavves/Documents/GitHub/egavves.github.io/
```

Or in Finder: drag the `dashboards/` folder into your `egavves.github.io` repo folder.

### 2. Commit and push

```bash
cd /Users/egavves/Documents/GitHub/egavves.github.io
git add dashboards/
git commit -m "Add Calli Labs intelligence dashboards"
git push
```

### 3. Verify

GitHub Pages deploys automatically within ~60 seconds of a push.
Visit: **https://egavves.github.io/dashboards/**

---

## Updating dashboards in the future

Whenever a dashboard is regenerated (e.g. after new data):

```bash
# Copy just the updated file
cp /path/to/"calli agent"/cut_feature_dashboard.html \
   /Users/egavves/Documents/GitHub/egavves.github.io/dashboards/

git add dashboards/cut_feature_dashboard.html
git commit -m "Update CUT dashboard with new data"
git push
```

---

## Optional: link from your main website

Add something like this to your main `index.html` or wherever you want the entry point:

```html
<a href="/dashboards/">Calli Labs Intelligence Dashboards</a>
```

---

## Notes

- All data is embedded in the HTML files — no CSV/JSON files needed on the server
- YouTube thumbnails are loaded from YouTube's CDN (requires internet)
- Video files are NOT hosted here — the dashboards link to YouTube videos by ID
- File sizes: Vault 449 KB · CUT 471 KB · Cinematheque 781 KB
