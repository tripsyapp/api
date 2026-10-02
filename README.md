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


## Keeping the reference current

Audit public routes against the current `tripsyapp/core` implementation: the
`api.tripsy.app` Nginx allowlist, `tripsy/api/urls.py`, `tripsy/api/urls_v2.py`, and
handler methods, serializers, and permission checks. An internal Django route
alone does not make an endpoint part of the supported public API. Keep the
Overview route summary and detailed guides synchronized, then run the production
build to validate navigation and links. Native authentication and billing
implementation details are outside this public reference.
