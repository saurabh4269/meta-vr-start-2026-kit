# Chapter 8: Build and Deploy | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/web/iwsdk-guide-build-deploy
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 23, 2026

This chapter shows how to build an IWSDK app for production, deploy it to GitHub Pages, or prepare it for optional Meta Horizon Store distribution.

Your starter app uses Vite to create a production build. When you run `npm run build`, it:

- Bundles and minifies your JavaScript/TypeScript code
- Generates a deployable static site in the `dist/` folder

Navigate to your project directory and run:

npm run build

This creates a `dist/` folder with your application. The build automatically:

- Bundles and minifies JavaScript
- Copies public assets

Vite copies files from `public/` without rewriting them. Optimize large models and
textures before you add them. After each production build, check their visual quality
and download size.

This section covers GitHub Pages. For additional hosting options, see
[Host your web experience](https://developers.meta.com/vr/documentation/web/web-hosting/).

GitHub Pages can host the static build. Choose one deployment method: a manual branch or GitHub Actions.

A GitHub project site uses a URL such as
`https://yourusername.github.io/your-repository-name/`. Set `base` to the
repository path in your existing Vite configuration:

```
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/your-repository-name/',
  // Keep the rest of your existing configuration, including plugins.
});
```
Use `base: '/'` for a user or organization site at
`https://yourusername.github.io/`. Also use it for a custom domain served from
its root.

Install the `gh-pages` tool, build, and publish `dist/` to the `gh-pages` branch:

npm install -D gh-pages
npm run build
npx gh-pages -d dist

In the repository, open **Settings** > **Pages**. Choose **Deploy from a branch**,
select the `gh-pages` branch and the root folder, and save.

Open **Settings** > **Pages**, then choose **GitHub Actions** as the source. Add
`.github/workflows/deploy.yml`:

```
name: Deploy to GitHub Pages
on:
  push:
    branches: ['main']
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
Progressive Web App (PWA) packaging is an optional Store distribution path for 2D sites, screen-based 3D sites, and immersive WebXR experiences. Bubblewrap creates an Android project that opens the hosted web app through a Trusted Web Activity.

Before packaging, deploy the app and a valid Web App Manifest to a public HTTPS URL. Store distribution also requires a signed package and matching Digital Asset Links at `/.well-known/assetlinks.json`.

Start with [Progressive Web Apps](https://developers.meta.com/vr/documentation/web/pwa-overview/), then follow [Package a PWA for Meta Quest](https://developers.meta.com/vr/documentation/web/pwa-packaging/) for app-mode, signing, asset-link, build, and sideload guidance.

You now have a production build, two GitHub Pages deployment options, and an optional Store distribution path. You also know how to:

- Set up an IWSDK project and load assets
- Add a background and lights
- Add grabbing and movement
- Write ECS components and systems
- Build and deploy the app

Support and legal

English (US)

© 2026 Meta