---
sidebar_position: 6
title: Email and Inbox
---

# Email and Inbox

## `GET /v1/emails`

Lists alternative email addresses for the authenticated user.

Authentication: required.

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 10,
      "email": "work@example.com",
      "verified": false
    },
    {
      "id": 11,
      "email": "travel@example.com",
      "verified": true
    }
  ]
}
```

## `POST /v1/emails/add`

Adds a new alternative email and sends a verification email.

Authentication: required.

Request body:

- `email` string, required

```bash
curl -X POST "https://api.tripsy.app/v1/emails/add" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "work@example.com"
  }'
```

Success:

```json
{
  "success": true
}
```

Status: `201 Created`.

Typical failures return `401 Unauthorized`:

```json
{
  "success": false,
  "error": "invalid_email"
}
```

```json
{
  "success": false,
  "error": "invalid_already_registered"
}
```

## `DELETE /v1/emails/{id}`

Deletes one alternative email owned by the current user.

Authentication: required.

Path parameters:

- `id` integer, required

```bash
curl -X DELETE "https://api.tripsy.app/v1/emails/10" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Success:

```json
{
  "success": true
}
```

If the email does not exist or belongs to another user, the endpoint still returns success.

## Automation emails

### `GET /v1/automation/emails`

Lists the current user's inbound emails that still need manual automation review.

Authentication: required.

Included items are owned by the current user, `parsed_successfully = false`, and not already attached to a trip, activity, hosting, or transportation.

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 55,
      "unique_parser_identifier": "imap:abc123",
      "date": "2026-03-17T09:30:00Z",
      "subject": "Flight confirmation",
      "body_preview": "Your flight is confirmed...",
      "attachments_count": 2
    }
  ]
}
```

### `GET /v1/automation/emails/{id}`

Returns one automation email in full detail.

Authentication: required.

Typical failure: `404 Not Found` if the email does not belong to the caller.

### `PUT /v1/automation/emails/{id}`
### `PATCH /v1/automation/emails/{id}`

Renames an automation email subject and/or moves it into a trip object.

Authentication: required.

Writable fields:

- `subject` string, optional
- `trip_id` integer, optional
- `activity_id` integer, optional
- `hosting_id` integer, optional
- `transportation_id` integer, optional

If any move field is present, existing associations are cleared first. Only one move target is applied, in this priority order: `trip_id`, `activity_id`, `hosting_id`, `transportation_id`.

Target object must be editable by the current user.

```bash
curl -X PATCH "https://api.tripsy.app/v1/automation/emails/55" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Renamed itinerary email",
    "trip_id": 42
  }'
```

Success: `200 OK` with an empty body.

Typical failure: `403 Forbidden`.

### `DELETE /v1/automation/emails/{id}`

Deletes one automation email owned by the current user.

Authentication: required.

Behavior:

- Clears all parent associations.
- Deletes the email.
- Returns success even if the email is already gone or not owned by the caller.

```json
{
  "success": true
}
```
