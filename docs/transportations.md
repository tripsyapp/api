---
title: Transportations
---

# Transportations

## `GET /v1/trip/{trip_id}/transportations`

Lists transportations for a trip.

Authentication: required.

Permissions: trip must be accessible to the caller.

Query parameters:

- `updatedSince=...` optional
- `transportationType=...` optional exact-match filter
- `fields=...` optional
- `fields!=...` optional

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 303,
      "name": "Flight to Rome",
      "transportation_type": "airplane",
      "documents": [],
      "emails": []
    }
  ]
}
```

## `POST /v1/trip/{trip_id}/transportations`

Creates a transportation item in a trip.

Authentication: required.

Permissions: trip must be editable by the caller.

Writable fields:

- `internal_identifier`
- `hidden`
- `name`
- `description`
- `notes`
- `transportation_type`
- `phone`
- `website`
- `departure_description`
- `departure_at`
- `departure_timezone`
- `departure_address`
- `departure_longitude`
- `departure_latitude`
- `arrival_description`
- `arrival_at`
- `arrival_timezone`
- `arrival_address`
- `arrival_longitude`
- `arrival_latitude`
- `company`
- `seat_number`
- `seat_class`
- `transport_number`
- `actual_transport_number`
- `coach_number`
- `vehicle_description`
- `departure_terminal`
- `departure_gate`
- `arrival_terminal`
- `arrival_gate`
- `arrival_bags`
- `flight_aware_identifier`
- `automatic_updates`
- `provider_url`
- `provider_document`
- `provider_reservation_code`
- `provider_reservation_description`
- `distance_meters`
- `price`
- `currency`
- `departure_apple_maps_id`

```bash
curl -X POST "https://api.tripsy.app/v1/trip/42/transportations" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Flight to Rome",
    "transportation_type": "airplane",
    "departure_description": "JFK",
    "departure_at": "2026-05-31T22:30:00Z",
    "departure_timezone": "America/New_York",
    "arrival_description": "FCO",
    "arrival_at": "2026-06-01T10:30:00Z",
    "arrival_timezone": "Europe/Rome",
    "company": "ITA Airways",
    "transport_number": "AZ609"
  }'
```

Success: `201 Created` with the created transportation object.

## Detail endpoint

Routes:

- `GET /v1/trip/{trip_id}/transportation/{id}`
- `PUT /v1/trip/{trip_id}/transportation/{id}`
- `PATCH /v1/trip/{trip_id}/transportation/{id}`
- `DELETE /v1/trip/{trip_id}/transportation/{id}`

Permissions:

- `GET`: trip accessible
- `PUT|PATCH|DELETE`: trip editable

Special update field:

- `update_trip` integer, optional

If `update_trip` is present, the transportation item is moved to the new trip and the success response is empty `200`.

Normal update success: full transportation object.

Delete success: `204 No Content`.

## Transportation documents

Routes:

- `POST /v1/trip/{trip_id}/transportation/{transportation_id}/documents`
- `PUT /v1/trip/{trip_id}/transportation/{transportation_id}/documents/{document_id}`
- `PATCH /v1/trip/{trip_id}/transportation/{transportation_id}/documents/{document_id}`
- `DELETE /v1/trip/{trip_id}/transportation/{transportation_id}/documents/{document_id}`

Authentication: required.

Permissions: caller must be allowed to edit trip documents.

Request and response behavior is the same as the hosting-document endpoints.
