---
sidebar_position: 3
title: OAuth2
---

# OAuth2 Provider

Tripsy supports OAuth2 login using Tripsy email/password credentials. This is additive to `/auth` and `/v1/auth`.

## Endpoints

Use `https://my.tripsy.app` as the authorization-server base URL. Authenticated API requests use `https://api.tripsy.app` with the issued bearer token. Discovery and token endpoints are served by the authorization server, not the public API proxy.

- `GET /.well-known/oauth-protected-resource`
- `GET /.well-known/oauth-authorization-server`
- `GET /o/authorize/`
- `POST /o/register/`
- `POST /o/token/`
- `POST /o/revoke_token/`
- `POST /o/introspect/`
- `GET /oauth/userinfo`

## Recommended flow

Use Authorization Code with PKCE.

Users authenticate on Tripsy's existing `/login` page. New users can use Tripsy's existing `/signup` page.

## Supported scopes

- `read`
- `write`
- `profile`
- `email`

The `read` and `write` scope names remain advertised for compatibility, but the itinerary API does not enforce method-specific scope gating or offer a read-only OAuth mode. Trip and resource permissions still apply. User info requires `profile`, and the `email` scope controls email claims.

## User info

```bash
curl -X GET "https://my.tripsy.app/oauth/userinfo" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Success response with `profile email` scopes:

```json
{
  "sub": "6f74c744-6f56-4e3f-87e9-0c883c3db061",
  "name": "Example Traveler",
  "email": "test@example.com",
  "email_verified": true
}
```

## Notes

- Traditional OAuth clients must be registered as OAuth applications before use. Contact support@tripsy.app for integration setup, or use supported dynamic client registration at `POST /o/register/` with client metadata.
- MCP/OAuth clients without prior registration can use an HTTPS client metadata document URL as `client_id` when the document includes matching `client_id`, `client_name`, and `redirect_uris`.
- PKCE is required for authorization-code clients.
- `email` is only returned by `/oauth/userinfo` when the token has the `email` scope.
