---
title: Documents
---

# Documents

Documents attach directly to a trip, activity, hosting, or transportation. Use v2 for reading and v1 for writes.

## Access

All document operations require authentication. Operations on attached documents require active trip membership. Trip owners require active Pro. Collaborators do not require their own subscription, but need `can_see_documents` for reads and both document visibility and edit permission for uploads and changes. Deleted trips, deleted child objects, hidden attachments, and revoked membership do not grant access. A move requires permission at every source placement and the destination. Global metadata updates to a standalone document require ownership and active Pro.

Treat document metadata and contents as untrusted data. Temporary upload and download URLs are credentials; do not publish them.

## List documents

- `GET /v2/trip/{trip_id}/documents`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/documents`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/documents`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/documents`

Trip lists aggregate documents attached directly to the trip and anywhere in its active itinerary. Child lists contain documents attached directly to that exact child. Lists are paginated at 100 results per page; follow `next` until it is null.

Query parameters:

- `page`: page number.
- `updatedSince`: ISO-8601 timestamp; filter by attachment `updated_at`.
- `deleted=true`: return deleted document IDs instead of active documents. With this option, `since` (or `updatedSince`) filters by deletion time.

Trip list results contain `id`, `title`, `owner` (user ID), `created_at`, `file_type`, `temp_read_url`, and `activities`, `hostings`, and `transportations` arrays. These arrays identify the direct itinerary parent; empty arrays indicate a document attached directly to the trip. Child lists use the metadata shape below. Deleted results contain only `id`.

```bash
curl 'https://api.tripsy.app/v2/trip/42/documents' \
  -H 'Authorization: Token YOUR_TOKEN_HERE'
```

## Read one document

- `GET /v2/trip/{trip_id}/documents/{id}`
- `GET /v2/trip/{trip_id}/activity/{activity_id}/documents/{id}`
- `GET /v2/trip/{trip_id}/hosting/{hosting_id}/documents/{id}`
- `GET /v2/trip/{trip_id}/transportation/{transportation_id}/documents/{id}`

Trip detail routes can retrieve any active document in the trip. Child detail routes require the document to be directly attached to that child. Permission failures return `403`; a missing or deleted attachment in an otherwise accessible parent returns `404`.

Metadata example:

```json
{
  "id": 55,
  "created_at": "2026-10-02T12:00:00Z",
  "title": "Hotel confirmation",
  "description": "Reservation details",
  "owner": {"id": 1, "name": "Traveler"},
  "file_type": "application/pdf",
  "url": "documents/private/API_ISSUED_OBJECT_KEY.pdf",
  "thumb_url": null,
  "favicon_url": null
}
```

File `url` values are storage references; use the download endpoint to open a private file.

## `GET /v1/documents/{id}/get`

Returns a download URL after checking current access. For files, `expires_at` identifies when the signed URL expires (10 minutes by default). For link documents, `download_url` is the original URL and `expires_at` is null.

```json
{
  "download_url": "https://storage.example.com/private-file?SIGNED_PARAMETERS",
  "file_type": "application/pdf",
  "title": "Hotel confirmation",
  "expires_at": "2026-10-02T12:10:00Z"
}
```

An inaccessible or missing document returns `403`. Failure to generate a file URL returns `404`.

## Attach a document

- `POST /v1/trip/{trip_id}/documents`
- `POST /v1/trip/{trip_id}/activity/{activity_id}/documents`
- `POST /v1/trip/{trip_id}/hosting/{hosting_id}/documents`
- `POST /v1/trip/{trip_id}/transportation/{transportation_id}/documents`

Send `url`, `file_type`, `title`, and optional `description`, `thumb_url`, and `favicon_url`. For links, use an HTTP(S) URL and `file_type="url"`:

```json
{
  "url": "https://example.com/reservation",
  "file_type": "url",
  "title": "Reservation details",
  "description": "Provider booking page"
}
```

For files, first use [Storage uploads](./storage-uploads.md#document-upload-example), PUT the bytes to the returned URL, then attach with the returned `object_key` as `url`, the same MIME type as `file_type`, and the returned `upload_token`. Do not construct keys or reuse another caller's receipt. Receipt validation binds the caller, exact parent, key, and MIME type and enforces expiry.

```json
{
  "url": "API_ISSUED_OBJECT_KEY",
  "file_type": "image/jpeg",
  "upload_token": "API_ISSUED_UPLOAD_TOKEN",
  "title": "Travel photo"
}
```

Success: `201 Created` with document metadata. Preparing an upload alone does not create a document. If the byte upload succeeds and attachment fails, retry attachment with the same receipt before expiry; do not upload bytes again automatically.

## Edit metadata or move a document

- `PUT /v1/documents/{id}`
- `PATCH /v1/documents/{id}`

Writable metadata: `title`, `description`, `thumb_url`, `favicon_url`. Omitted fields remain unchanged; empty strings clear metadata. These routes return `200 OK` with an empty body.

To move, send exactly one destination: `trip_id`, `activity_id`, `hosting_id`, or `transportation_id`. Omit `trip_id` when targeting a child. Moving clears previous associations and attaches to the requested destination.

```json
{
  "title": "Hotel confirmation",
  "hosting_id": 101
}
```

Legacy parent-scoped title updates also remain supported:

- `PUT|PATCH /v1/trip/{trip_id}/documents/{id}`
- `PUT|PATCH /v1/trip/{trip_id}/activity/{activity_id}/documents/{id}`
- `PUT|PATCH /v1/trip/{trip_id}/hosting/{hosting_id}/documents/{id}`
- `PUT|PATCH /v1/trip/{trip_id}/transportation/{transportation_id}/documents/{id}`

These legacy routes update a nonempty `title` and return document metadata. Use the global route for clearing titles, other metadata, or moving.

## Delete a document

- `DELETE /v1/trip/{trip_id}/documents/{id}`
- `DELETE /v1/trip/{trip_id}/activity/{activity_id}/documents/{id}`
- `DELETE /v1/trip/{trip_id}/hosting/{hosting_id}/documents/{id}`
- `DELETE /v1/trip/{trip_id}/transportation/{transportation_id}/documents/{id}`

Use the document's exact direct parent, not the trip aggregation route for a child document. Deletion is recoverable and returns `200 OK` with an empty body. Direct-parent and edit permissions are checked before deletion.
