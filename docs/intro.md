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

Request bodies use `application/json` unless an endpoint says otherwise. Response bodies are JSON.

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

`GET /v2/trips` and all `/v2/trip/...` fetch endpoints use the standard paginated list envelope.

## Field filtering

Trips, hostings, activities, transportations, and expenses support field filtering:

```text
?fields=id,name,starts_at
?fields!=documents,emails
```

Some fields may still be omitted based on permissions:

- `price` and `currency` may be hidden if the caller cannot see expenses.
- `documents` and `emails` may be hidden if the caller cannot see documents.

## Route Summary

### Auth and account

- `POST /auth`
- `POST /v1/auth`
- `POST /auth/apple`
- `POST /v1/signup`
- `POST /auth/login/`
- `POST /auth/logout/`
- `GET|PUT|PATCH /auth/user/`
- `POST /auth/password/reset/`
- `POST /auth/password/reset/confirm/`
- `POST /auth/password/change/`
- `GET|PUT|PATCH /v1/me`

### Email and inbox

- `GET /v1/emails`
- `POST /v1/emails/add`
- `DELETE /v1/emails/{id}`
- `GET /v1/automation/emails`
- `GET|PUT|PATCH|DELETE /v1/automation/emails/{id}`
- `GET /v1/documents/{id}/get`
- `PUT|PATCH /v1/documents/{id}`

### Storage

- `POST /v1/storage/uploads`

### Trips

- `GET|POST /v1/trips`
- `GET|PUT|PATCH|DELETE /v1/trips/{id}`

### Trips v2 fetch-only

- `GET /v2/trips`
- `GET /v2/trip/{trip_id}/documents`
- `GET /v2/trip/{trip_id}/emails`
- `GET /v2/trip/{trip_id}/hostings`
- `GET /v2/trip/{trip_id}/hosting/{id}`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/documents`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/emails`
- `GET /v2/trip/{trip_id}/activities`
- `GET /v2/trip/{trip_id}/activity/{id}`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/documents`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/emails`
- `GET /v2/trip/{trip_id}/transportations`
- `GET /v2/trip/{trip_id}/transportation/{id}`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/documents`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/emails`

### Trip subresources

- `GET|POST /v1/trip/{trip_id}/hostings`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/hosting/{id}`
- `GET|POST /v1/trip/{trip_id}/activities`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/activity/{id}`
- `GET|POST /v1/trip/{trip_id}/transportations`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/transportation/{id}`
- `GET|POST /v1/trip/{trip_id}/expenses`
- `GET|PUT|PATCH|DELETE /v1/trip/{trip_id}/expense/{id}`
- `GET /v1/trip/{trip_id}/collaborators`
- `POST /v1/trip/{trip_id}/documents`
- `PUT|PATCH|DELETE /v1/trip/{trip_id}/documents/{document_id}`
