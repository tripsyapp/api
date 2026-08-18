---
sidebar_position: 5
title: Storage Uploads
---

# Storage Upload API

## `POST /v1/storage/uploads`

Creates a temporary S3 upload URL.

Authentication: optional for public image uploads.

Request body:

- `purpose` string, required: `profile_photo` or `trip_cover`
- `filename` string, required
- `content_type` string, required
- `content_length` integer, optional
- `parent_type` string, optional for `trip_cover`: `trip`
- `parent_id` integer, required whenever `parent_type` is sent

Defaults:

- `profile_photo` and `trip_cover` default to `public`.

Validation:

- `profile_photo` must not send `parent_type` or `parent_id`.
- `trip_cover` may omit `parent_type` and `parent_id`.
- If a `trip_cover` parent is provided, it must use `parent_type="trip"` and `parent_id`.

Permissions:

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
