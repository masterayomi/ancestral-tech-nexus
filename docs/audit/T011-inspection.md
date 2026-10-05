# T-011 Inspection Summary (Audit Trail)

Current audit behavior:
- Governance.tsx inserts into audit_logs directly from client (knowledge_approved, knowledge_revision_requested, knowledge_published). This depends on client voluntarily calling audit; actor is currentUser.id (client-supplied context). RLS on audit_logs: currently no client INSERT policies after T-005? T-005 dropped all policies on audit_logs (server-only intent). Live schema: audit_logs exists; policies unknown. If no INSERT policy exists for authenticated, these client inserts will fail. If policies exist allowing INSERT, this allows fabrication risk.
- KnowledgeRepository has no audit inserts.
- No DB triggers/functions auto-generate audit on knowledge_objects mutations (creation/update/status changes).
- handle_new_user etc are auth triggers (separate domain).

Issues (T-011):
1. Audit generation is client-initiated, not server-enforced. Bypassed if using direct DB access or if code omits calls.
2. audit_logs has no client policies per T-005 intent (server-only) — but existing UI code tries to INSERT from client. This creates mismatch: either block client inserts (correct) and move to server, or allow insecurely.
3. No provenance guarantees; client cannot be trusted for privileged event recording.

Recommendation (T-011): Make audit server-enforced. Options: (a) SECURITY DEFINER audit function insert_audit() callable only by trusted functions, (b) trigger-based audit on knowledge_objects for state-changing events (with context), (c) have lifecycle RPCs write audit (not clients). Also enforce: no client INSERT to audit_logs (T-005 already does). Update UI to call RPCs (T-010) which write audit server-side. Add audit function and modify RPCs to record audit with auth.uid() server-side. Ensure no recursion.
