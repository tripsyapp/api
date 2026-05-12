---
title: Documents
---

# Documents

## `POST /v1/trip/{trip_id}/documents`

Attaches a new document to a trip.

Authentication: required.

Permissions: caller must be allowed to edit trip documents.

Request body:

- `url`
- `thumb_url`
- `favicon_url`
- `file_type`
- `title`
- `description`

Notes:

- External links should continue using the original URL in `url`.
- Uploaded private files should use the `object_key` returned by `POST /v1/storage/uploads`.
- This endpoint remains backward-compatible and does not require a new field for uploaded documents.

Success: `201 Created` with the created document object.

## `PUT /v1/trip/{trip_id}/documents/{document_id}`
## `PATCH /v1/trip/{trip_id}/documents/{document_id}`

Renames an existing trip document.

Authentication: required.

Permissions: caller must be allowed to edit trip documents.

Request body:

- `title`

Success response: updated document object.

## `DELETE /v1/trip/{trip_id}/documents/{document_id}`

Removes a document from a trip.

Authentication: required.

Permissions: caller must be allowed to edit trip documents.

Success: empty `200 OK`.

## `PUT /v1/documents/{id}`
## `PATCH /v1/documents/{id}`

Renames a document and/or moves it to another parent object.

Authentication: required.

Writable fields:

- `title` string, optional
- `trip_id` integer, optional
- `activity_id` integer, optional
- `hosting_id` integer, optional
- `transportation_id` integer, optional

If a move field is provided, the document is detached from all existing parents first. The new target must exist and the current user must have permission to edit documents there.

```bash
curl -X PATCH "https://api.tripsy.app/v1/documents/280258" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "activity_id": 202,
    "title": "Updated ticket"
  }'
```

Success: `200 OK` with an empty body.

## `GET /v1/documents/{id}/get`

Returns a temporary URL for reading one document.

Authentication: required.

Permissions: caller must have read access to the document.

Behavior:

- For uploaded documents, the API returns a temporary S3 URL in `download_url`.
- For link documents where `file_type == "url"`, the API returns the original external URL in `download_url`.
- `expires_at` is only present for temporary S3 URLs and is `null` for external links.

```bash
curl -X GET "https://api.tripsy.app/v1/documents/280258/get" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Uploaded document response:

```json
{
  "download_url": "https://storage.example.com/download/...",
  "file_type": "application/pdf",
  "title": "Boarding Pass",
  "expires_at": "2026-04-22T14:00:00Z"
}
```

Link document response:

```json
{
  "download_url": "https://tripsy.app",
  "file_type": "url",
  "title": "Tripsy",
  "expires_at": null
}
```
