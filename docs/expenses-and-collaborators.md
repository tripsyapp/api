---
title: Expenses and Collaborators
---

# Expenses and Collaborators

## `GET /v1/trip/{trip_id}/expenses`

Lists expenses for a trip.

Authentication: required.

Permissions: caller must be allowed to see trip expenses.

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 404,
      "title": "Dinner",
      "date": "2026-06-03T20:00:00Z",
      "price": 78.5,
      "currency": "EUR",
      "owner": 1,
      "trip": 42
    }
  ]
}
```

## `POST /v1/trip/{trip_id}/expenses`

Creates an expense.

Authentication: required.

Permissions: caller must be allowed to edit trip expenses.

Writable fields:

- `title`
- `date`
- `price`
- `currency`

```bash
curl -X POST "https://api.tripsy.app/v1/trip/42/expenses" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dinner",
    "currency": "EUR",
    "price": 78.5,
    "date": "2026-06-03T20:00:00Z"
  }'
```

Success: `201 Created` with the created expense object.

## Expense detail endpoint

Routes:

- `GET /v1/trip/{trip_id}/expense/{id}`
- `PUT /v1/trip/{trip_id}/expense/{id}`
- `PATCH /v1/trip/{trip_id}/expense/{id}`
- `DELETE /v1/trip/{trip_id}/expense/{id}`

Permissions:

- `GET`: caller must be allowed to see trip expenses.
- `PUT|PATCH|DELETE`: caller must be allowed to edit trip expenses.

Normal update success: full expense object.

Delete success: `204 No Content`.

## `GET /v1/trip/{trip_id}/collaborators`

Lists collaborators and invited users for a trip.

Authentication: required.

Permissions: trip must be accessible to the caller.

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "photo_url": null,
      "permissions": {
        "is_owner": true,
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
  ]
}
```

The list includes the owner, edit collaborators, view collaborators, and users with pending invitations. `joined=false` means the user has a pending invitation and has not yet joined the trip.
