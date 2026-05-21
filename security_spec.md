# HarnessOS Security Specification

## Data Invariants
1. **User Identity Isolation**: Users can only read and write their own profile documents.
2. **Workspace Containment**: Access to workspace-owned harnesses and instances is restricted to members and owners of that workspace.
3. **Template Immutability**: Only administrators (`content_editor`, `admin`, `super_admin`) can create or modify `HarnessCategory` and `HarnessTemplate` documents.
4. **Harness Version Control**: Only editors can create new versions of a template. Users can read public template versions.
5. **Instance Security**: A `HarnessInstance` must be linked to a valid `Workspace`. Only workspace members can interact with instances.
6. **Immutable Fields**: `createdAt`, `ownerId`, and `workspaceId` must never change after creation.
7. **Premium Lockdown**: Users can only see full `HarnessVersion` content if they have purchased the harness (simulated here via a relational check or premium flag logic).

## The Dirty Dozen (Attacker Payloads)

1. **Identity Spoofing**: Attempt to create a user profile with a different UID than the authenticated user.
   - Target: `/users/target-uid` | Payload: `{ "uid": "target-uid", "email": "attacker@evil.com", "role": "admin" }`
2. **RBAC Escalation**: Attempt to update own role to `super_admin`.
   - Target: `/users/my-uid` | Payload: `{ "role": "super_admin" }`
3. **Template Poisoning**: Attempt to modify a premium harness description as a guest/user.
   - Target: `/templates/t-cs-001` | Payload: `{ "description": "Hacked description" }`
4. **Category Deletion**: Attempt to delete a business category as a regular user.
   - Target: `/categories/customer-support` | Action: `DELETE`
5. **Instance Hijacking**: Attempt to read instances belonging to another workspace.
   - Target: `/workspaces/other-ws/instances/inst-1` | Action: `GET`
6. **Orphaned Instance Creation**: attempt to create an instance pointing to a non-existent workspace.
   - Target: `/workspaces/fake-ws/instances/new-inst` | Payload: `{ "workspaceId": "fake-ws", ... }`
7. **Large Field Resource Poisoning**: Attempt to write a 2MB system prompt.
   - Target: `/templates/t-id/versions/v-id` | Payload: `{ "systemPrompt": "A".repeat(2*1024*1024) }`
8. **Immutable Field Tampering**: Attempt to change a workspace `ownerId`.
   - Target: `/workspaces/ws-id` | Payload: `{ "ownerId": "attacker-uid" }`
9. **Status Shortcut**: Attempt to set an instance status from `draft` to `active` without passing quality gates (if rules enforced this).
10. **ID Injection**: Large junk string for category ID.
   - Target: `/categories/` + "A".repeat(2000)
11. **PII Leak**: Attempt to list all users as a regular authenticated user.
    - Target: `/users/` | Action: `LIST`
12. **Audit Log Erasure**: Attempt to delete admin logs.
    - Target: `/audit-logs/log-id` | Action: `DELETE`

## Test Runner (Conceptual)
All payloads above must return `PERMISSION_DENIED`.
