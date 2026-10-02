---
sidebar_position: 99
title: Errors
---

# Common Error Patterns

These are the most common response codes across the exposed API surface:

- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `405 Method Not Allowed`

Typical meanings:

- `400`: validation failure
- `401`: missing or invalid authentication, or a public auth flow failure
- `403`: authenticated but not allowed to access or modify the target object
- `404`: object not found, or object does not belong to the caller
- `405`: method not supported by the endpoint

For document and attached-email routes, `403` also covers missing document visibility/edit permission, an owner's inactive Pro subscription, and inaccessible parent objects. Attachment detail routes return `404` for an absent or deleted attachment after parent authorization succeeds. Invalid, expired, or mismatched file upload receipts return `400`.

An HTML `404` page mentioning nginx usually means the request was rejected by the public proxy before reaching the API. Verify the route (for example, `/v2/trip/42/documents`, not `/v2/42/documents`) and that the public virtual-host configuration includes the deployed endpoints.
