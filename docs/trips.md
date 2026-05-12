---
sidebar_position: 7
title: Trips
---

# Trips

## `GET /v1/trips`

Lists trips accessible to the authenticated user.

Authentication: required.

Accessible means the caller is the trip owner, an edit collaborator, or a view collaborator.

Query parameters:

- `updatedSince` optional ISO-8601 datetime
- `fields=...` optional
- `fields!=...` optional

Notes on `updatedSince`:

- Accepts timestamps such as `2026-03-17T00:00:00Z`.
- The implementation subtracts 2 days before filtering.
- Includes trips changed directly or via nested updates.
- Collaborator trips are always included in the filtered response.

```bash
curl -X GET "https://api.tripsy.app/v1/trips?updatedSince=2026-03-15T00:00:00Z" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Success response uses the custom trips envelope:

```json
{
  "results": [
    {
      "id": 42,
      "name": "Italy",
      "timezone": "Europe/Rome",
      "starts_at": "2026-06-01",
      "ends_at": "2026-06-15",
      "documents": [],
      "emails": []
    }
  ]
}
```

## `POST /v1/trips`

Creates a new trip.

Authentication: required.

Writable fields:

- `internal_identifier`
- `name`
- `timezone`
- `hidden`
- `description`
- `starts_at`
- `ends_at`
- `cover_gradient`
- `cover_image_url`
- `has_dates`
- `number_of_days`

```bash
curl -X POST "https://api.tripsy.app/v1/trips" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Italy",
    "starts_at": "2026-06-01",
    "ends_at": "2026-06-15",
    "timezone": "Europe/Rome",
    "description": "Summer vacation"
  }'
```

Success: `201 Created` with a trip object.

Important behavior:

- The server sets `owner` to the authenticated user.
- The trip owner automatically receives full permissions.
- If `internal_identifier` already exists for another trip owned by the same user and is longer than 5 characters, the endpoint returns an empty `200` response instead of creating a duplicate.

## `GET /v1/trips/{id}`

Returns one trip accessible to the current user.

Authentication: required.

Success response: trip object.

## `PUT /v1/trips/{id}`
## `PATCH /v1/trips/{id}`

Updates a trip.

Authentication: required.

Writable fields are the same trip fields used on create.

For uploaded trip cover images, call `POST /v1/storage/uploads` with `purpose=trip_cover`, upload the bytes to S3, then save the returned `public_url` into `cover_image_url`.

If the trip already exists, the client may also send `parent_type="trip"` and the trip `id`, but that is optional.

Success response: trip object.

## `DELETE /v1/trips/{id}`

Deletes a trip.

Authentication: required.

Success: `204 No Content`.
