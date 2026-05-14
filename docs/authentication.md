---
sidebar_position: 2
title: Authentication
---

# Authentication

Most routes require token authentication:

```http
Authorization: Token YOUR_TOKEN_HERE
```

Example:

```bash
curl -X GET "https://api.tripsy.app/v1/me" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Public routes

- `POST /auth`
- `POST /v1/auth`
- `POST /auth/apple`
- `POST /v1/signup`
- `POST /auth/login/`
- `POST /auth/password/reset/`
- `POST /auth/password/reset/confirm/`

## Authenticated routes

- `POST /auth/logout/`
- `GET|PUT|PATCH /auth/user/`
- `POST /auth/password/change/`
- all `/v1/...` and `/v2/...` routes not listed above as public

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

## `POST /auth/apple`

Signs in or signs up with Sign in with Apple.

Authentication: public.

Request body:

- `authorization_code` string, required
- `client_id` string, optional
- `nonce` string, optional
- `user` object, optional
- `email` string, optional
- `name` string, optional
- `first_name` string, optional
- `last_name` string, optional

```bash
curl -X POST "https://api.tripsy.app/auth/apple" \
  -H "Content-Type: application/json" \
  -d '{
    "authorization_code": "APPLE_AUTHORIZATION_CODE",
    "client_id": "app.tripsy.ios",
    "nonce": "NONCE_SENT_TO_APPLE",
    "user": {
      "name": {
        "firstName": "Example",
        "lastName": "Traveler"
      },
      "email": "traveler@example.com"
    }
  }'
```

Success response:

```json
{
  "token": "4b7a4b8c9f0d..."
}
```

Possible error status codes: `400`, `401`, `409`, `503`.

Important behavior:

- For a brand-new Apple account, Apple must provide an email address.
- Existing users can be linked by Apple `sub` or by matching email.
- The API validates the Apple token and cross-checks any client-provided email against the Apple claims.

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
