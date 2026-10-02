---
sidebar_position: 2
title: Authentication
---

# Authentication

Most routes require authentication. API tokens use:

```http
Authorization: Token YOUR_TOKEN_HERE
```

OAuth access tokens instead use `Authorization: Bearer ACCESS_TOKEN`. Obtain tokens from the [OAuth authorization server](./oauth2.md). The API does not currently distinguish read-only and write-only OAuth access to itinerary routes; normal object permissions still apply.

Example:

```bash
curl -X GET "https://api.tripsy.app/v1/me" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Public routes

- `POST /auth`
- `POST /v1/auth`
- `POST /v1/signup`
- `POST /auth/login/`
- `POST /auth/password/reset/`
- `POST /auth/password/reset/confirm/`
- `GET /v1/emails/{hash}/verify` (verification link)
- `POST /v1/storage/uploads` for public profile photos and trip covers only

## Authenticated routes

- `POST /auth/logout/`
- `GET|PUT|PATCH /auth/user/`
- `POST /auth/password/change/`
- all `/v1/...` and `/v2/...` routes not listed above as public; private document upload preparation always requires authentication

## `POST /auth`

Preferred custom token login endpoint. Exchanges email-or-username plus password for a Tripsy API token.

Authentication: public.

Request body:

- `username` string, required
- `password` string, required

`username` may be either the user email or the Tripsy username. If the value does not contain `@`, the API tries to resolve the user and authenticate with the account email.

```bash
curl -X POST "https://api.tripsy.app/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'
```

Success response:

```json
{
  "token": "4b7a4b8c9f0d..."
}
```

Typical error:

```json
{
  "non_field_errors": [
    "Unable to log in with provided credentials."
  ]
}
```

## `POST /v1/auth`

Alias of the same custom token login flow used by the mobile app. Request body and response are the same as `POST /auth`.

## `POST /auth/login/`

Alternative login endpoint.

Authentication: public.

Request body:

- `username` string, optional
- `email` string, optional
- `password` string, required

At least one of `username` or `email` must be provided.

```bash
curl -X POST "https://api.tripsy.app/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Success response:

```json
{
  "key": "4b7a4b8c9f0d..."
}
```

## `POST /auth/logout/`

Logs out the authenticated user.

Authentication: required.

```bash
curl -X POST "https://api.tripsy.app/auth/logout/" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Success response:

```json
{
  "detail": "Successfully logged out."
}
```

## Password endpoints

### `POST /auth/password/reset/`

Requests a password reset email.

Authentication: public.

Request body:

- `email` string, required

```json
{
  "detail": "Password reset e-mail has been sent."
}
```

### `POST /auth/password/reset/confirm/`

Completes a password reset using the token from the reset email.

Authentication: public.

Request body:

- `uid` string, required
- `token` string, required
- `new_password1` string, required
- `new_password2` string, required

```json
{
  "detail": "Password has been reset with the new password."
}
```

### `POST /auth/password/change/`

Changes the authenticated user's password.

Authentication: required.

Request body:

- `new_password1` string, required
- `new_password2` string, required

```json
{
  "detail": "New password has been saved."
}
```
