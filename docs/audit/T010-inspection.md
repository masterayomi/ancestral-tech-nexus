# T-010 Inspection Summary (Knowledge Lifecycle)

Frontend/Client flows (direct DB updates):
- KnowledgeRepository.tsx: insert/update knowledge_objects directly (handleSave). Also soft/hard delete. Sets validation_status = 'draft' or passed status. No server-side guards visible; relies on RLS.
- admin/Governance.tsx: approve → sets validation_status 'approved' (direct update). reject → 'revision_requested' (direct). publish → 'published' + published_at (direct). Also inserts audit_logs directly from client.
- admin/AdminDashboard.tsx: reads counts by validation_status.
- AuthManagement.tsx, ProfileEditor.tsx: role changes exist (ProfileEditor removed self-service role assignment per T-008).

DB boundary:
- Triggers exist live: trg_knowledge_object_version (creates knowledge_versions on changes), trg_knowledge_objects_updated_at (auto-updates updated_at). These are SECURITY DEFINER (live schema shows functions/triggers). Versioning is server-enforced via trigger.
- Functions: trg_record_knowledge_version, update_updated_at_column, is_admin_user, handle_new_user, sync_user_role (live).
- RLS: ko_* policies govern access; INSERT policy set as dropped for knowledge_versions (T-004) — version creation server-only. But knowledge_objects status transitions (submit/review/approve/publish) have no DB constraints/functions enforcing workflow rules.

Issues (T-010):
1. Clients can directly update validation_status/published_at on knowledge_objects (bypasses lifecycle rules). No check that approver != submitter, no state machine (draft→under_review→approved→published), no permission checks enforced server-side beyond RLS.
2. Self-publish possible if client sends status='published' and RLS allows update? RLS depends on ko_update_* policies (live). Not visible in full form; need to assume client can set any fields if policy allows UPDATE on row owner/admin. This is bypassable.
3. No server function (RPC) for submit/approve/reject/publish — transitions are client-controlled.
4. audit_logs INSERT is client-side in Governance (T-011 issue). Also user can spoof actor if RLS weak? (T-011)
5. Versioning is server-enforced (trigger) — good. But lifecycle not.

Recommendation (T-010): Add SECURITY DEFINER RPCs for lifecycle transitions (submit_for_review, approve_knowledge, reject_revision, publish_knowledge). Enforce rules server-side: only creator can submit from draft; only admins/reviewers can approve/reject; prevent self-approval; enforce valid state transitions; set published_at/server-side. Replace client direct status updates with RPCs (defense-in-depth). Add constraints or at least check functions. Migrations required.
