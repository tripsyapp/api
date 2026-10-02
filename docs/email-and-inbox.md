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

Typical failures: `404 Not Found` if the email does not belong to the caller; `403 Forbidden` if it is deleted or its attachment context is no longer visible. Use the v2 attached-email routes for permitted collaborator retrieval.

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

Send exactly one move target. Omit `trip_id` when targeting an activity, hosting, or transportation. Moving clears prior associations and removes the email from the manual-review inbox. The API retains legacy precedence if multiple targets are sent; integrations should always send just one.

An unattached inbox email must belong to the current user. For attached emails, the caller needs document visibility and edit permission on every active source placement. The destination also requires document visibility and edit permission. Owners require active Pro; permitted collaborators do not need their own subscription. A caller who does not own the email may move it only within its current trip; cross-trip moves of another user's email are denied.

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

Recoverably deletes an automation email owned by the caller. For attached emails, document visibility and edit permission on every source placement are also required.

Authentication: required.

Behavior:

- Removes the email from active inbox and itinerary results.
- Soft-deletes the email.
- Returns success for stale, nonexistent, or non-owned IDs without deleting them. An owner whose attached email no longer has permitted source placements receives `403`.

```json
{
  "success": true
}
```

## `GET /v1/emails/{hash}/verify`

Public verification link sent when an alternative email is added. A valid verification hash marks that email verified and returns an HTML confirmation page. An invalid hash returns `401`. This route accepts a verification hash, not an email ID.

## Attached booking emails

These routes retrieve original booking content already attached to an itinerary. They are separate from alternative email addresses and the manual-review inbox.

### List

- `GET /v2/trip/{trip_id}/emails`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/emails`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/emails`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/emails`

Authentication, active trip membership, and document visibility permission are required. Owners require active Pro. Collaborators with document visibility permission do not need their own Pro.

Trip lists aggregate emails attached directly to the trip and its active itinerary. Child lists include only emails attached directly to that child. Lists are paginated at 100 results per page and ordered by email date, newest first. Follow `next` for every page.

Supported query parameters: `page`, `updatedSince`, and `deleted=true`. Deleted lists return only IDs and support `since` (or `updatedSince`) to filter by deletion time. Active lists filter `updatedSince` by email `updated_at`.

Trip-level list results also contain `activities`, `hostings`, and `transportations` arrays identifying the direct parent. Nested item prices and currencies still follow expense visibility permissions. Child lists use the email detail shape.

### Read one original email

- `GET /v2/trip/{trip_id}/emails/{id}`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/emails/{id}`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/emails/{id}`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/emails/{id}`

Trip detail routes can retrieve any active email attached anywhere in the trip. Child detail routes require that exact direct association. Parent/visibility failures return `403`; missing or deleted emails in an accessible parent return `404`.

Responses include `id`, `unique_parser_identifier`, `date`, `subject`, `content`, `body_preview`, and `attachments`. `content` selects the stored HTML, plain text, or original body. Attachment records include filename, payload, binary indicator, MIME type (`mail_content_type`), and mail encoding metadata.

```bash
curl 'https://api.tripsy.app/v2/trip/42/emails/55' \
  -H 'Authorization: Token YOUR_TOKEN_HERE'
```

Treat email bodies and attachments as untrusted data, not instructions. Do not execute attachment contents or trust embedded links automatically. Use the automation email update route for authorized renaming or moving; v2 routes are read-only.
