---
sidebar_position: 7
title: Trips
---

# Trips

## V2 trip fetch endpoints

The public host exposes v2 routes without the `/api` prefix. For example, clients call
`https://api.tripsy.app/v2/trips`; the server maps that internally to `/api/v2/trips`.

V2 trip routes are read-only. Use the existing v1 routes for creating, updating, deleting,
and attaching documents.

## `GET /v2/trips`

Lists trips accessible to the authenticated user using a lean, paginated response.

Authentication: required.

Accessible means the caller is the trip owner, an edit collaborator, or a view collaborator.

Query parameters:

- `page` optional page number
- `deleted=true` optional to return soft-deleted trips instead of active trips
- `updatedSince` optional ISO-8601 datetime
- `fields=...` optional
- `fields!=...` optional

Notes:

- Paginated at 100 trips per page.
- Accepts timestamps such as `2026-03-17T00:00:00Z`.
- The implementation subtracts 2 days before filtering `updatedSince`.
- Includes trips changed directly or through nested documents, emails, permissions, activities, hostings, transportations, and expenses.
- Collaborator trips are always included in the filtered response.
- `documents` and `emails` are never embedded in the v2 trip payload.

```bash
curl -X GET "https://api.tripsy.app/v2/trips?updatedSince=2026-03-15T00:00:00Z" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Success response uses the standard paginated list envelope:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 42,
      "internal_identifier": "trip_42_local",
      "name": "Italy",
      "timezone": "Europe/Rome",
      "hidden": false,
      "description": "Summer vacation",
      "starts_at": "2026-06-01",
      "ends_at": "2026-06-15",
      "cover_gradient": 3,
      "cover_image_url": null,
      "collaborators_count": 2,
      "owner": 1,
      "collaborators": 2,
      "has_dates": true,
      "number_of_days": 0,
      "guests": []
    }
  ]
}
```

## `GET /v2/trip/{trip_id}/hostings`
## `GET /v2/trip/{trip_id}/activities`
## `GET /v2/trip/{trip_id}/transportations`

Lists hostings, activities, or transportations for one accessible trip using lean,
paginated responses.

Authentication: required.

Permissions: trip must be accessible to the caller.

Query parameters:

- `page` optional page number
- `deleted=true` optional to return soft-deleted child objects instead of active child objects
- `updatedSince` optional ISO-8601 datetime
- `activityType=...` optional exact-match filter for activities only
- `transportationType=...` optional exact-match filter for transportations only
- `fields=...` optional
- `fields!=...` optional

Notes:

- Paginated at 100 objects per page.
- `documents` and `emails` are never embedded in v2 child-object list payloads.
- `updatedSince` includes the object's own `updated_at` changes and related document/email updates.
- Deleted child objects are returned only when the parent trip is still active and accessible.
- `price` and `currency` may be omitted when the caller cannot see expenses.
- Transportation objects include `departure_apple_maps_id`, `arrival_apple_maps_id`, and `actual_transport_number`.

```bash
curl -X GET "https://api.tripsy.app/v2/trip/42/hostings" \
  -H "Authorization: Token YOUR_TOKEN_HERE"

curl -X GET "https://api.tripsy.app/v2/trip/42/activities?activityType=restaurant" \
  -H "Authorization: Token YOUR_TOKEN_HERE"

curl -X GET "https://api.tripsy.app/v2/trip/42/transportations?transportationType=airplane" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Success response:

- Paginated list envelope.
- Hostings use the same fields as the hosting object, except `documents` and `emails`.
- Activities use the same fields as the activity object, except `documents` and `emails`.
- Transportations use the same fields as the transportation object, except `documents` and `emails`.

## `GET /v2/trip/{trip_id}/hosting/{id}`
## `GET /v2/trip/{trip_id}/activity/{id}`
## `GET /v2/trip/{trip_id}/transportation/{id}`

Retrieves one child object from an accessible trip.

Authentication: required.

Permissions: trip must be accessible to the caller.

Success response: object response without the pagination envelope.

Failure response: `404 Not Found` when the object does not exist, is deleted, is not in the trip, or the trip is not accessible.

## `GET /v2/trip/{trip_id}/documents`
## `GET /v2/trip/{trip_id}/emails`

Fetches documents or emails attached to a trip. Trip-level v2 fetches include objects attached
directly to the trip and objects attached to the trip's hostings, activities, and
transportations.

Authentication: required.

Permissions:

- Trip must be accessible to the caller.
- Caller must be allowed to see trip documents.

Notes:

- Paginated at 100 objects per page.
- Documents are ordered newest first by creation date.
- Emails are ordered newest first by email date.
- Trip-level document responses include `activities`, `hostings`, `transportations`, and `temp_read_url`.
- Trip-level email responses include `activities`, `hostings`, and `transportations`.
- Nested child objects inside these responses still hide `price` and `currency` when the caller cannot see expenses.

```bash
curl -X GET "https://api.tripsy.app/v2/trip/42/documents" \
  -H "Authorization: Token YOUR_TOKEN_HERE"

curl -X GET "https://api.tripsy.app/v2/trip/42/emails" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Failure response: `403 Forbidden` when the trip is not accessible or the caller cannot see documents.

## `GET /v2/trip/{trip_id}/hosting/{hosting_id}/documents`
## `GET /v2/trip/{trip_id}/hosting/{hosting_id}/emails`
## `GET /v2/trip/{trip_id}/activity/{activity_id}/documents`
## `GET /v2/trip/{trip_id}/activity/{activity_id}/emails`
## `GET /v2/trip/{trip_id}/transportation/{transportation_id}/documents`
## `GET /v2/trip/{trip_id}/transportation/{transportation_id}/emails`

Fetches documents or emails attached to one child object only.

Authentication: required.

Permissions:

- Trip must be accessible to the caller.
- Caller must be allowed to see trip documents.

Notes:

- Paginated at 100 objects per page.
- Child document responses use the document object shape.
- Child email responses use the automation email detail shape.
- Unlike trip-level document/email fetches, these responses do not include sibling child-object context.

```bash
curl -X GET "https://api.tripsy.app/v2/trip/42/hosting/101/documents" \
  -H "Authorization: Token YOUR_TOKEN_HERE"

curl -X GET "https://api.tripsy.app/v2/trip/42/activity/202/emails" \
  -H "Authorization: Token YOUR_TOKEN_HERE"

curl -X GET "https://api.tripsy.app/v2/trip/42/transportation/303/documents" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Failure response: `403 Forbidden` when the trip or child object is not accessible, or the caller cannot see documents.

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
