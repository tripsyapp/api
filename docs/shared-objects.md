---
sidebar_position: 98
title: Shared Objects
---

# Shared Object Examples

## User profile object

Returned by `GET /v1/me` and `PUT|PATCH /v1/me`.

```json
{
  "id": 1,
  "name": "Test User",
  "username": "test@example.com",
  "email": "test@example.com",
  "is_premium": false,
  "is_tripit_connected": false,
  "premium_expiration_date": null,
  "last_activity_date": "2026-03-17T14:30:00Z",
  "language": "en",
  "business": [],
  "calendar_identifier": "abc123",
  "calendar_emojis": false,
  "calendar_hidden_categories": null,
  "calendar_lodgings_all_day": true,
  "calendar_trips_all_day": true,
  "photo_url": null,
  "is_newsletter_subscriber": true,
  "timezone": "America/Sao_Paulo",
  "default_currency": "USD",
  "store_currency": "USD",
  "anonymous_email_identifier": "anon_testuser",
  "notifications_flights_general_enabled": true,
  "notifications_flights_departure_and_arrival": true,
  "notifications_collaborators_new_activities_enabled": true
}
```

## Alternative email object

```json
{
  "id": 10,
  "email": "work@example.com",
  "verified": false
}
```

## Automation email object

List item:

```json
{
  "id": 55,
  "unique_parser_identifier": "imap:abc123",
  "date": "2026-03-17T09:30:00Z",
  "subject": "Flight confirmation",
  "body_preview": "Your flight is confirmed...",
  "attachments_count": 2
}
```

Detail item:

```json
{
  "id": 55,
  "unique_parser_identifier": "imap:abc123",
  "date": "2026-03-17T09:30:00Z",
  "content": "<html><body>Flight details...</body></html>",
  "subject": "Flight confirmation",
  "body_preview": "Flight details...",
  "attachments": [
    {
      "id": 3,
      "filename": "boarding_pass.pdf",
      "payload": null,
      "binary": true,
      "mail_content_type": "application/pdf",
      "content_id": null,
      "content_disposition": "attachment",
      "charset": null,
      "content_transfer_encoding": null
    }
  ]
}
```

## Document object

```json
{
  "id": 280258,
  "created_at": "2026-03-17T14:30:00Z",
  "title": "Boarding pass",
  "description": "Uploaded from the app",
  "owner": {
    "id": 1,
    "name": "Test User"
  },
  "file_type": "application/pdf",
  "url": "https://cdn.example.com/boarding-pass.pdf",
  "thumb_url": null,
  "favicon_url": null
}
```

## Trip object

```json
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
  "documents": [],
  "has_dates": true,
  "number_of_days": 0
}
```

## Hosting object

```json
{
  "id": 101,
  "owner": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "photo_url": null
  },
  "internal_identifier": "hosting_101_local",
  "trip": 42,
  "hidden": false,
  "starts_at": "2026-06-01T14:00:00Z",
  "ends_at": "2026-06-05T11:00:00Z",
  "timezone": "Europe/Rome",
  "name": "Hotel Eden",
  "description": "",
  "address": "Via Ludovisi 49, Rome, Italy",
  "longitude": 12.4896,
  "latitude": 41.9054,
  "phone": "+39 06 478121",
  "room_type": "Deluxe",
  "room_number": "402",
  "website": "https://example.com/hotel",
  "notes": "",
  "provider_reservation_code": "ABC123",
  "emails": [],
  "documents": [],
  "price": 1200,
  "currency": "EUR",
  "created_at": "2026-03-17T14:30:00Z",
  "updated_at": "2026-03-17T14:30:00Z"
}
```

## Activity object

```json
{
  "id": 202,
  "owner": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "photo_url": null
  },
  "internal_identifier": "activity_202_local",
  "trip": 42,
  "hidden": false,
  "activity_type": "sightseeing",
  "period": null,
  "starts_at": "2026-06-03T09:00:00Z",
  "ends_at": "2026-06-03T11:00:00Z",
  "all_day": false,
  "name": "Colosseum Tour",
  "description": "Guided visit",
  "checked": false,
  "address": "Piazza del Colosseo, Rome, Italy",
  "longitude": 12.4922,
  "latitude": 41.8902,
  "timezone": "Europe/Rome",
  "documents": [],
  "emails": [],
  "price": 45,
  "currency": "EUR",
  "created_at": "2026-03-17T14:30:00Z",
  "updated_at": "2026-03-17T14:30:00Z"
}
```

## Transportation object

```json
{
  "id": 303,
  "owner": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "photo_url": null
  },
  "internal_identifier": "transport_303_local",
  "trip": 42,
  "hidden": false,
  "name": "Flight to Rome",
  "transportation_type": "airplane",
  "departure_description": "JFK",
  "departure_at": "2026-05-31T22:30:00Z",
  "departure_timezone": "America/New_York",
  "arrival_description": "FCO",
  "arrival_at": "2026-06-01T10:30:00Z",
  "arrival_timezone": "Europe/Rome",
  "company": "ITA Airways",
  "seat_number": "12A",
  "seat_class": "economy",
  "transport_number": "AZ609",
  "departure_terminal": "4",
  "departure_gate": "B22",
  "arrival_terminal": "3",
  "documents": [],
  "emails": [],
  "price": 890,
  "currency": "USD",
  "created_at": "2026-03-17T14:30:00Z",
  "updated_at": "2026-03-17T14:30:00Z"
}
```

## Expense object

```json
{
  "id": 404,
  "title": "Dinner",
  "date": "2026-06-03T20:00:00Z",
  "price": 78.5,
  "currency": "EUR",
  "owner": 1,
  "trip": 42
}
```

## Collaborator object

```json
{
  "id": 2,
  "name": "Travel Partner",
  "email": "partner@example.com",
  "photo_url": null,
  "permissions": {
    "is_owner": false,
    "can_edit": true,
    "can_see_expenses": true,
    "can_edit_expenses": true,
    "can_see_documents": true,
    "can_edit_documents": true,
    "is_travelling": true,
    "receive_notifications": true
  },
  "joined": true
}
```
