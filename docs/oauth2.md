---
sidebar_position: 3
title: OAuth2
---

# OAuth2 Provider

Tripsy supports OAuth2 login using Tripsy email/password credentials. This is additive to `/auth`, `/v1/auth`, and `/auth/apple`.

## Endpoints

- `GET /.well-known/oauth-protected-resource`
- `GET /.well-known/oauth-authorization-server`
- `GET /o/authorize/`
- `POST /o/token/`
- `POST /o/revoke_token/`
- `GET /oauth/userinfo`

## Recommended flow

Use Authorization Code with PKCE.

Users authenticate on Tripsy's existing `/login` page. New users can use Tripsy's existing `/signup` page.

## Supported scopes

- `read`
- `write`
- `profile`
- `email`

## User info

```bash
curl -X GET "https://api.tripsy.app/oauth/userinfo" \
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

- Traditional OAuth clients must be registered as OAuth applications before use. To enable OAuth authentication for your integration, contact support@tripsy.app and request OAuth client credentials.
- MCP/OAuth clients without prior registration can use an HTTPS client metadata document URL as `client_id` when the document includes matching `client_id`, `client_name`, and `redirect_uris`.
- PKCE is required for authorization-code clients.
- `email` is only returned by `/oauth/userinfo` when the token has the `email` scope.
