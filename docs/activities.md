---
title: Activities
---

# Activities

## `GET /v1/trip/{trip_id}/activities`

Lists activities for a trip.

Authentication: required.

Permissions: trip must be accessible to the caller.

Query parameters:

- `updatedSince=...` optional
- `activityType=...` optional exact-match filter
- `fields=...` optional
- `fields!=...` optional

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 202,
      "name": "Colosseum Tour",
      "activity_type": "sightseeing",
      "documents": [],
      "emails": []
    }
  ]
}
```

## `POST /v1/trip/{trip_id}/activities`

Creates an activity in a trip.

Authentication: required.

Permissions: trip must be editable by the caller.

Writable fields:

- `internal_identifier`
- `hidden`
- `activity_type`
- `period`
- `starts_at`
- `ends_at`
- `all_day`
- `name`
- `description`
- `phone`
- `website`
- `checked`
- `address`
- `longitude`
- `latitude`
- `notes`
- `apple_maps_id`
- `timezone`
- `provider_location_url`
- `provider_document`
- `provider_reservation_code`
- `provider_reservation_description`
- `google_places_id`
- `price`
- `currency`

```bash
curl -X POST "https://api.tripsy.app/v1/trip/42/activities" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Colosseum Tour",
    "activity_type": "sightseeing",
    "starts_at": "2026-06-03T09:00:00Z",
    "ends_at": "2026-06-03T11:00:00Z",
    "address": "Piazza del Colosseo, Rome, Italy",
    "timezone": "Europe/Rome"
  }'
```

Success: `201 Created` with the created activity object.

## Detail endpoint

Routes:

- `GET /v1/trip/{trip_id}/activity/{id}`
- `PUT /v1/trip/{trip_id}/activity/{id}`
- `PATCH /v1/trip/{trip_id}/activity/{id}`
- `DELETE /v1/trip/{trip_id}/activity/{id}`

Permissions:

- `GET`: trip accessible
- `PUT|PATCH|DELETE`: trip editable

Special update field:

- `update_trip` integer, optional

If `update_trip` is present, the activity is moved to the new trip and the success response is empty `200`.

Normal update success: full activity object.

Delete success: `204 No Content`.

## Activity documents

Routes:

- `POST /v1/trip/{trip_id}/activity/{activity_id}/documents`
- `PUT /v1/trip/{trip_id}/activity/{activity_id}/documents/{document_id}`
- `PATCH /v1/trip/{trip_id}/activity/{activity_id}/documents/{document_id}`
- `DELETE /v1/trip/{trip_id}/activity/{activity_id}/documents/{document_id}`

Authentication: required.

Permissions: caller must be allowed to edit trip documents.

Request and response behavior is the same as the hosting-document endpoints.
