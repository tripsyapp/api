---
title: Custom Categories
---

# Custom Categories

Custom categories are available for Activity objects through `activity_type`. Use built-in types for hostings and transportations.

All routes require authentication.

## `GET /v1/categories`

Lists active categories owned by the caller and users who share an active trip with the caller. Visibility follows current trip membership; categories are not copied onto trips.

The list is not paginated and uses a `results` envelope:

```json
{
  "results": [
    {
      "id": 10,
      "owner": 1,
      "slug": "architecture",
      "name": "Architecture",
      "icon_name": "customicon-building",
      "color": "#4A90E2"
    }
  ]
}
```

## `GET /v1/categories/{id}`

Returns one visible category object. Deleted or inaccessible categories return `404`.

## `POST /v1/categories`

Creates a category owned by the caller. Writable fields: `name`, `slug`, `icon_name`, `color`. Omit `slug` to generate one automatically. Omitted or blank colors and omitted or unrecognized icons use server defaults.

```json
{
  "name": "Architecture",
  "slug": "architecture",
  "color": "#4A90E2"
}
```

Success: `201 Created` with the category. If the caller already owns the supplied slug, the API returns an empty `200 OK` instead of creating a duplicate.

## `PUT /v1/categories/{id}`
## `PATCH /v1/categories/{id}`

Updates the same writable fields on a category owned by the caller. Categories visible through shared trips cannot be edited by the caller unless they own them.

Success: `200 OK` with the updated object.

## `DELETE /v1/categories/{id}`

Recoverably deletes a category owned by the caller. Success: `204 No Content`.

## Using categories

Use the returned `slug` as an activity's `activity_type`. When displaying an unknown built-in slug, resolve it against the visible category list and use its `name`, `icon_name`, and `color`.
