---
title: Guests and Permissions
---

# Guests and Permissions

All routes require authentication. Existing trip guests are managed separately from `guest_invites` during trip creation.

## `GET /v1/guests/favorites`

Lists confirmed account favorites and pending invitations, ordered newest first, with the standard paginated envelope.

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 20,
      "favorite_user": {"id": 2, "name": "Travel partner", "email": "partner@example.com", "photo_url": null},
      "automatic_suggest_on_new_trips": true,
      "pending": false,
      "created_at": "2026-10-02T12:00:00Z",
      "updated_at": "2026-10-02T12:00:00Z"
    }
  ]
}
```

`favorite_user.id` is the user ID; the top-level `id` identifies the favorite or invitation record. Preserve `pending`: an outstanding invitation is not a confirmed favorite. Pending entries can also include `inviter`.

## `POST /v1/guests/invite`

Invites a known user to an existing trip. Requires active trip membership and `can_add_guests`.

```json
{
  "trip_id": 42,
  "invited_user_email": "partner@example.com",
  "permissions": {
    "read_only": false,
    "can_add_guests": false,
    "can_see_expenses": true,
    "can_edit_expenses": true,
    "can_see_documents": true,
    "can_edit_documents": true,
    "is_travelling": true
  }
}
```

`permissions` is optional and can also contain an invitation `title`. The API limits granted permissions to the caller's own capabilities. Read-only access disables edit and guest-management permissions.

The invitee must be a confirmed favorite or share another active trip with the caller. Unknown and unrelated email addresses return the same `404` error. Confirmed favorites can be added directly; other eligible users receive an invitation. Already-member requests can return success without changing membership. Check [collaborators](./expenses-and-collaborators.md) afterward; invitation success alone does not mean the recipient has joined.

## `PATCH /v1/trip/{trip_id}/collaborator/{user_id}/permissions`

Updates an existing member's permissions. The direct API requires a numeric `user_id`; CLI/MCP clients resolve their `me` shortcut before sending the request.

Writable boolean fields:

- `can_edit`
- `can_add_guests`
- `can_see_expenses`
- `can_edit_expenses`
- `can_see_documents`
- `can_edit_documents`
- `is_travelling`
- `receive_notifications`

Changing another member's permissions requires `can_add_guests`. The caller cannot grant capabilities they do not have. Setting `can_edit=false` also disables guest management and expense/document editing.

Members may change their own `is_travelling` or `receive_notifications` without guest-management permission by sending that preference alone. Only the owner can change the owner's preferences, and owner requests must contain exactly one of these two fields.

```bash
curl -X PATCH 'https://api.tripsy.app/v1/trip/42/collaborator/1/permissions' \
  -H 'Authorization: Token YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{"is_travelling": false}'
```

Success: `200 OK` with `user_id` and the complete `permissions` object. `is_owner` is read-only. `PUT` is not supported on this route.

## `DELETE /v1/trip/{trip_id}/collaborator/{user_id}`

Removes a collaborator or pending invitee. Members can remove themselves; removing another user requires ownership or `can_add_guests`. The owner cannot be removed through this route.

Removal revokes membership and pending invitation access and clears assignments to itinerary items. Success: `200 OK` with `{}`. Authorized repeated deletion requests are idempotent.

## Legacy roster alias

`GET /v1/trip/{trip_id}/collaborator/{user_id}` currently uses the same roster handler as `GET /v1/trip/{trip_id}/collaborators`; it does not return a single-user detail object. Prefer the plural route and select the user from the results.
