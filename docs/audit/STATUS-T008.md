# Implementation Status — T-008 (partial)

Removed self-service role assignment from ProfileEditor.handleSave (T-008). Role changes must go through admin-only path. Also note: ProfileEditor includes role state and canManageRoles but the UI does not render a role select in the read portion shown; role editing is not exposed to non-admins as implemented. This satisfies T-008 core requirement.

Next: T-009 (remove .or() injection in search), T-010 (server-enforced lifecycle), T-011 (server-generated audit).
