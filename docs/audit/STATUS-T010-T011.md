# Implementation Status — T-010–T-011 (Migrations & Design)

Migrations added:
- 0010_knowledge_lifecycle_rpc.sql: submit_knowledge_for_review, approve_knowledge (prevents self-approval), reject_knowledge, publish_knowledge. All SECURITY DEFINER, search_path safe, enforce state transitions, only creator/admin as appropriate.
- 0011_audit_helpers.sql: insert_audit() SECURITY DEFINER helper; audit_logs remain server-only (no client INSERT policies). 
- 0012_lifecycle_audit.sql: lifecycle RPCs call insert_audit() server-side with auth.uid().

UI impact:
- Governance.tsx currently does direct updates + client-side audit INSERTs. With audit_logs having no client INSERT policies (T-005) and to enforce server rules, Governance should switch to calling RPCs. Also prevents bypass.
- KnowledgeRepository direct inserts/updates still allow setting validation_status directly from client — acceptable for draft creation in UI if RLS allows; but approval/publish paths must not use direct updates. T-010 is about server enforcement (strongest boundary). Client code should be updated to use RPCs for transitions (defense-in-depth). Not changing all UI now to minimize surface; core transition paths in Governance are the main ones.

Next steps:
- Update Governance.tsx to call RPCs instead of direct .update() for approve/reject/publish (and submit if applicable).
- Optionally add trigger-based audit for create/update of knowledge_objects (server-enforced even if client bypasses UI). Add migration for that.
- Add tests/sanity checks; run typecheck/lint.
- Continue with lint/dependency hygiene (T-013–T-016) and test harness foundation (T-027) per plan, reassessing repo state.
