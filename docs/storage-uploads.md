---
sidebar_position: 5
title: Storage Uploads
---

# Storage Upload API

## `POST /v1/storage/uploads`

Creates a temporary backend-signed S3 upload URL.

Authentication:

- Required for `document`.
- Optional for public image uploads: `profile_photo`, `trip_cover`.

Request body:

- `purpose` string, required: `document`, `profile_photo`, or `trip_cover`
- `filename` string, required
- `content_type` string, required
- `visibility` string, optional: `private` or `public`
- `content_length` integer, optional
- `parent_type` string, required for `document`, optional for `trip_cover`: `trip`, `activity`, `hosting`, or `transportation`
- `parent_id` integer, required whenever `parent_type` is sent

Defaults:

- `document` defaults to `private`.
- `profile_photo` and `trip_cover` default to `public`.

Validation:

- `document` requires `parent_type` and `parent_id`.
- `profile_photo` must not send `parent_type` or `parent_id`.
- `trip_cover` may omit `parent_type` and `parent_id`.
- If a `trip_cover` parent is provided, it must use `parent_type="trip"` and `parent_id`.

Permissions:

- `document`: caller must be allowed to edit documents on the target object.
- `profile_photo`: no authentication required.
- `trip_cover`: no authentication required.

## Behavior

The backend returns a presigned S3 `PUT` URL. The client uploads bytes directly to S3 using `upload_url` and must send the exact headers returned by this endpoint.

Do not send Tripsy auth headers to S3.

Private document uploads are stored with a long random filename plus a safe extension. Public profile photos and trip cover images are stored in public image storage.

For private document uploads, use `object_key` as the existing document `url` field when creating the document later. For public uploads, use `public_url` when updating `photo_url` or `cover_image_url`.

## Private trip document example

```bash
curl -X POST "https://api.tripsy.app/v1/storage/uploads" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "purpose": "document",
    "parent_type": "trip",
    "parent_id": 123,
    "filename": "boarding-pass.pdf",
    "content_type": "application/pdf",
    "content_length": 58213
  }'
```

```json
{
  "upload_url": "https://storage.example.com/upload/...",
  "method": "PUT",
  "headers": {
    "Content-Type": "application/pdf"
  },
  "object_key": "7b2d2c7f0f0c4d5cb1e3ecf299cb3f3a7b2d2c7f0f0c4d5cb1e3ecf299cb3f3a7b2d2c7f0f0c4d5cb1e3ecf299cb3f3a7b2d2c7f0f0c4d5cb1e3ecf299cb3f3a.pdf",
  "bucket": "PRIVATE_DOCUMENTS_BUCKET",
  "purpose": "document",
  "visibility": "private",
  "expires_at": "2026-04-22T13:15:00Z",
  "content_length": 58213
}
```

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
3. For `document`, call the matching document create endpoint and send `url=object_key`.
4. For `profile_photo`, call `PATCH /v1/me` and send `photo_url=public_url`.
5. For `trip_cover`, call `PATCH /v1/trips/{id}` and send `cover_image_url=public_url`.

Public image uploads may happen before the user or trip exists. Attaching the returned `public_url` is the step that still requires the normal authenticated update API.
