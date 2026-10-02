---
sidebar_position: 1
slug: /
title: Overview
---

# Tripsy Public API

The Tripsy Public API is exposed through:

```text
https://api.tripsy.app
```

Examples:

```text
https://api.tripsy.app/v1/me
https://api.tripsy.app/v1/trips
https://api.tripsy.app/v2/trips
https://api.tripsy.app/auth
```

## Content types

Request bodies use `application/json` unless an endpoint says otherwise. Response bodies are generally JSON; some successful updates and deletes have an empty body, and email verification links render an HTML page.

## Datetimes

Datetimes use UTC ISO-8601:

```text
YYYY-MM-DDTHH:MM:SSZ
```

Example:

```text
2026-03-17T14:30:00Z
```

## List envelopes

Most list endpoints return paginated responses:

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": []
}
```

`GET /v1/trips` is the exception and returns:

```json
{
  "results": []
}
```

`GET /v2/trips` and `/v2/trip/...` list endpoints use the standard paginated envelope. Detail endpoints return a single object. `GET /v1/categories` returns an unpaginated `results` envelope.

## Field filtering

Trips, hostings, activities, transportations, and expenses support field filtering:

```text
?fields=id,name,starts_at
?fields!=emails
```

Some fields may still be omitted based on permissions:

- `price` and `currency` may be hidden if the caller cannot see expenses.
- Document and booking-email content requires document visibility permission. Owners need active Pro; permitted collaborators do not need their own Pro.

## Route Summary

Use the public paths below; do not add the internal `/api/` prefix. The public virtual-host configuration must be deployed alongside the backend when new paths are introduced.

### Auth and account

- `POST /auth`
- `POST /v1/auth`
- `POST /v1/signup`
- `POST /auth/login/`
- `POST /auth/logout/`
- `GET|PUT|PATCH /auth/user/`
- `POST /auth/password/reset/`
- `POST /auth/password/reset/confirm/`
- `POST /auth/password/change/`
- `GET|PUT|PATCH /v1/me`

OAuth discovery, registration, authorization, token, revocation, introspection, and user info use the separate [authorization server](./oauth2.md).

### Email and inbox

- `GET /v1/emails`
- `POST /v1/emails/add`
- `DELETE /v1/emails/{id}`
- `GET /v1/emails/{hash}/verify`
- `GET /v1/automation/emails`
- `GET|PUT|PATCH|DELETE /v1/automation/emails/{id}`

### Storage and document metadata

- `POST /v1/storage/uploads`
- `GET /v1/documents/{id}/get`
- `PUT|PATCH /v1/documents/{id}`

See [Documents](./documents.md) for the complete attachment and upload flows.

### Categories and guests

- `GET|POST /v1/categories`
- `GET|PUT|PATCH|DELETE /v1/categories/{id}`
- `GET /v1/guests/favorites`
- `POST /v1/guests/invite`
- `GET /v1/trip/{trip_id}/collaborators`
- `GET|DELETE /v1/trip/{trip_id}/collaborator/{user_id}`
- `PATCH /v1/trip/{trip_id}/collaborator/{user_id}/permissions`

### Trips

- `GET|POST /v1/trips`
- `GET|PUT|PATCH|DELETE /v1/trips/{id}`
- `GET /v2/trips`

### Itinerary objects

- `GET|POST /v1/trip/{trip_id}/hostings`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/hosting/{id}`
- `GET|POST /v1/trip/{trip_id}/activities`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/activity/{id}`
- `GET|POST /v1/trip/{trip_id}/transportations`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/transportation/{id}`
- `GET|POST /v1/trip/{trip_id}/expenses`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/expense/{id}`
- `GET /v2/trip/{trip_id}/hostings`
- `GET /v2/trip/{trip_id}/hosting/{id}`
- `GET /v2/trip/{trip_id}/activities`
- `GET /v2/trip/{trip_id}/activity/{id}`
- `GET /v2/trip/{trip_id}/transportations`
- `GET /v2/trip/{trip_id}/transportation/{id}`

### Document attachment writes

- `POST /v1/trip/{trip_id}/documents`
- `PUT|PATCH|DELETE /v1/trip/{trip_id}/documents/{id}`
- `POST /v1/trip/{trip_id}/activity/{activity_id}/documents`
- `PUT|PATCH|DELETE /v1/trip/{trip_id}/activity/{activity_id}/documents/{id}`
- `POST /v1/trip/{trip_id}/hosting/{hosting_id}/documents`
- `PUT|PATCH|DELETE /v1/trip/{trip_id}/hosting/{hosting_id}/documents/{id}`
- `POST /v1/trip/{trip_id}/transportation/{transportation_id}/documents`
- `PUT|PATCH|DELETE /v1/trip/{trip_id}/transportation/{transportation_id}/documents/{id}`

### Document reads

- `GET /v2/trip/{trip_id}/documents`
- `GET /v2/trip/{trip_id}/documents/{id}`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/documents`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/documents/{id}`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/documents`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/documents/{id}`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/documents`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/documents/{id}`

### Attached booking-email reads

- `GET /v2/trip/{trip_id}/emails`
- `GET /v2/trip/{trip_id}/emails/{id}`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/emails`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/emails/{id}`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/emails`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/emails/{id}`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/emails`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/emails/{id}`
