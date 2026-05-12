---
title: Hostings
---

# Hostings

## `GET /v1/trip/{trip_id}/hostings`

Lists hostings for a trip.

Authentication: required.

Permissions: trip must be accessible to the caller.

Query parameters:

- `updatedSince=...` optional
- `fields=...` optional
- `fields!=...` optional

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 101,
      "name": "Hotel Eden",
      "documents": [],
      "emails": []
    }
  ]
}
```

## `POST /v1/trip/{trip_id}/hostings`

Creates a hosting in a trip.

Authentication: required.

Permissions: trip must be editable by the caller.

Writable fields:

- `internal_identifier`
- `hidden`
- `starts_at`
- `ends_at`
- `timezone`
- `name`
- `description`
- `address`
- `longitude`
- `latitude`
- `phone`
- `apple_maps_id`
- `room_type`
- `room_number`
- `website`
- `notes`
- `provider_location_url`
- `provider_document`
- `provider_reservation_code`
- `provider_reservation_description`
- `google_places_id`
- `price`
- `currency`

```bash
curl -X POST "https://api.tripsy.app/v1/trip/42/hostings" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Eden",
    "address": "Via Ludovisi 49, Rome, Italy",
    "starts_at": "2026-06-01T14:00:00Z",
    "ends_at": "2026-06-05T11:00:00Z",
    "timezone": "Europe/Rome",
    "price": 1200,
    "currency": "EUR"
  }'
```

Success: `201 Created` with the created hosting object.

Important behavior:

- Duplicate `internal_identifier` in the same trip returns empty `200`.

## Detail endpoint

Routes:

- `GET /v1/trip/{trip_id}/hosting/{id}`
- `PUT /v1/trip/{trip_id}/hosting/{id}`
- `PATCH /v1/trip/{trip_id}/hosting/{id}`
- `DELETE /v1/trip/{trip_id}/hosting/{id}`

Permissions:

- `GET`: trip accessible
- `PUT|PATCH|DELETE`: trip editable

Special update field:

- `update_trip` integer, optional

If `update_trip` is present, the hosting is moved to the new trip and the success response is empty `200`.

Normal update success: full hosting object.

Delete success: `204 No Content`.

## Hosting documents

Routes:

- `POST /v1/trip/{trip_id}/hosting/{hosting_id}/documents`
- `PUT /v1/trip/{trip_id}/hosting/{hosting_id}/documents/{document_id}`
- `PATCH /v1/trip/{trip_id}/hosting/{hosting_id}/documents/{document_id}`
- `DELETE /v1/trip/{trip_id}/hosting/{hosting_id}/documents/{document_id}`

Authentication: required.

Permissions: caller must be allowed to edit trip documents.

Create body:

- `url`
- `thumb_url`
- `favicon_url`
- `file_type`
- `title`
- `description`

Update body:

- `title`

Create/update success response: document object.

Delete success: empty `200 OK`.
