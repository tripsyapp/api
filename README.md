# Tripsy Public API Docs

This repository contains the Docusaurus site for the public Tripsy API documentation.

## Local Development

```bash
npm install
npm run start
```

The local site runs at `http://localhost:3000`.

## Build

```bash
npm run build
```

## Publishing

The `Deploy Docusaurus to GitHub Pages` workflow builds the site and publishes it with GitHub Pages.

The custom domain is configured through `static/CNAME`:

```text
docs.api.tripsy.app
```

In GitHub repository settings, configure Pages to use **GitHub Actions** as the source.
