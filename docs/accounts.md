---
sidebar_position: 4
title: Accounts
---

# Accounts

## `POST /v1/signup`

Creates a new Tripsy account using email/password credentials.

Authentication: public.

Request body:

- `username` string, required
- `password` string, required
- `email` string, optional
- `name` string, optional
- `photo_url` string, optional

Validation:

- `username` and `email` are normalized to lowercase.
- If `email` is omitted, it defaults to `username`.
- Duplicate username returns a field-level validation error.
- Duplicate email returns a generic account-creation error.

```bash
curl -X POST "https://api.tripsy.app/v1/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "username": "newuser@example.com",
    "email": "newuser@example.com",
    "password": "securepassword123"
  }'
```

Success: `201 Created` with a user profile object.

Typical duplicate username error:

```json
{
  "username": [
    "A user with this username already exists."
  ]
}
```

Typical duplicate email error:

```json
{
  "non_field_errors": [
    "Unable to create account."
  ]
}
```

## `GET /v1/me`

Returns the current authenticated user profile.

Authentication: required.

```bash
curl -X GET "https://api.tripsy.app/v1/me" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Success response: a full user profile object. See [Shared objects](./shared-objects.md#user-profile-object).

## `PATCH /v1/me`
## `PUT /v1/me`

Updates selected profile and preference fields for the current user.

Authentication: required.

Writable fields:

- `photo_url`
- `username`
- `email`
- `name`
- `language`
- `calendar_emojis`
- `calendar_hidden_categories`
- `calendar_lodgings_all_day`
- `calendar_trips_all_day`
- `timezone`
- `default_currency`
- `store_currency`
- `notifications_flights_general_enabled`
- `notifications_flights_departure_and_arrival`
- `notifications_collaborators_new_activities_enabled`

Notes:

- The API always updates `last_activity_date`.
- `email` must not be blank.
- `email` must not match another user primary email.
- `email` must not match another user alternative email.
- Blank or whitespace `username` is ignored instead of saved.
- Blank or null ASA fields are ignored instead of overwriting existing values.
- For uploaded profile photos, call `POST /v1/storage/uploads` with `purpose=profile_photo`, upload bytes to the returned S3 URL, then save `public_url` into `photo_url`.

```bash
curl -X PATCH "https://api.tripsy.app/v1/me" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "language": "es",
    "timezone": "America/Mexico_City",
    "default_currency": "MXN",
    "store_currency": "USD",
    "photo_url": "https://example.com/photo.jpg"
  }'
```

Success response: same shape as `GET /v1/me`.

## `GET /auth/user/`
## `PUT /auth/user/`
## `PATCH /auth/user/`

Alternative user-details endpoint.

Authentication: required.

Response shape:

```json
{
  "pk": 1,
  "username": "testuser",
  "email": "test@example.com",
  "first_name": "",
  "last_name": ""
}
```

Writable fields:

- `username`
- `first_name`
- `last_name`

Read-only field:

- `email`
