---
sidebar_position: 5
title: Storage Uploads
---

# Storage Upload API

## `POST /v1/storage/uploads`

Creates a temporary S3 upload URL.

Authentication: required for documents; optional for public profile-photo and trip-cover uploads.

Request body:

- `purpose` string, required: `document`, `profile_photo`, or `trip_cover`
- `filename` string, required
- `content_type` string, required
- `content_length` integer: required for documents, optional for public images
- `visibility` string: `private` for documents, `public` for public images; defaults by purpose
- `parent_type` string: required for documents (`trip`, `activity`, `hosting`, `transportation`); optional for trip covers (`trip`)
- `parent_id` positive integer: exact parent ID, required whenever `parent_type` is sent

Defaults:

- `document` defaults to `private`; public document uploads are rejected.
- `profile_photo` and `trip_cover` default to `public`; private public-image uploads are rejected.

Validation:

- Document uploads require both parent fields and an exact `content_length` from 1 to 104857600 bytes (100 MiB). The MCP inline upload tool limits files to 8 MiB and MCP upload preparation to 25 MiB.
- Parent fields must be sent together.
- `profile_photo` must not send `parent_type` or `parent_id`.
- `trip_cover` may omit `parent_type` and `parent_id`.
- If a `trip_cover` parent is provided, it must use `parent_type="trip"` and `parent_id`.

Permissions:

- `document`: authenticated trip membership plus document visibility and edit permissions. Owners require active Pro; permitted collaborators do not need their own Pro.
- `profile_photo`: no authentication required.
- `trip_cover`: no authentication required.

## Behavior

The API returns a presigned S3 `PUT` URL. The client uploads bytes directly to S3 using `upload_url` and must send the exact headers returned by this endpoint.

Do not send Tripsy auth headers to S3.

Profile photos and trip cover images are stored in public image storage. Use `public_url` when updating `photo_url` or `cover_image_url`.

## Profile photo example

```bash
curl -X POST "https://api.tripsy.app/v1/storage/uploads" \
  -H "Content-Type: application/json" \
  -d '{
    "purpose": "profile_photo",
    "filename": "avatar.jpg",
    "content_type": "image/jpeg"
  }'
```

```json
{
  "upload_url": "https://storage.example.com/upload/...",
  "method": "PUT",
  "headers": {
    "Content-Type": "image/jpeg",
    "x-amz-acl": "public-read"
  },
  "object_key": "2a9f6b3ea63a4f0d8cb8fba0abed9d2b2a9f6b3ea63a4f0d8cb8fba0abed9d2b2a9f6b3ea63a4f0d8cb8fba0abed9d2b2a9f6b3ea63a4f0d8cb8fba0abed9d2b.jpg",
  "bucket": "PUBLIC_PROFILE_IMAGES_BUCKET",
  "purpose": "profile_photo",
  "visibility": "public",
  "expires_at": "2026-04-22T13:15:00Z",
  "public_url": "https://cdn.example.com/profile-images/2a9f6b3ea63a4f0d8cb8fba0abed9d2b.jpg"
}
```

## Client migration flow

1. Call `POST /v1/storage/uploads`.
2. Upload bytes to `upload_url`.
3. For `profile_photo`, call `PATCH /v1/me` and send `photo_url=public_url`.
4. For `trip_cover`, call `PATCH /v1/trips/{id}` and send `cover_image_url=public_url`.

Public image uploads may happen before the user or trip exists. Attaching the returned `public_url` is the step that still requires the normal authenticated update API.

## Document upload example

1. Prepare a private file upload for the exact parent. `parent_id` is the trip ID for a trip parent, or the itinerary item's ID for a child parent.

```bash
curl -X POST 'https://api.tripsy.app/v1/storage/uploads' \
  -H 'Authorization: Token YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
    "purpose": "document",
    "parent_type": "trip",
    "parent_id": 42,
    "filename": "photo.jpg",
    "content_type": "image/jpeg",
    "content_length": 12345
  }'
```

Use the file's actual byte count for `content_length`. The response includes `upload_url`, `method="PUT"`, exact `headers` (including `Content-Type` and `Content-Length`), `object_key`, `bucket`, `purpose="document"`, `visibility="private"`, `content_length`, `expires_at`, and `upload_token`. It does not include `public_url`.

2. PUT the file bytes to `upload_url` with every returned header exactly as supplied. URLs and receipts expire after 15 minutes by default. Never forward your Tripsy token to S3.
3. [Attach the file](./documents.md#attach-a-document) to the same parent using `object_key` as `url`, the same MIME type as `file_type`, and `upload_token`.

The receipt is bound to the caller, exact parent, key, and MIME type. Preparing or uploading bytes does not create a document by itself. If attachment fails after the upload succeeds, retry attachment with the same valid receipt.
