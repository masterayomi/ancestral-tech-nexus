# ADR-0004: Admin Separation (Separate Workspace/Origin)

Status: Proposed
Date: 2026-10-04

Context: Admin must be functionally separate with strong boundaries.

Decision: Create separate Vite workspace/origin for admin app. Server-side/database authorization is required in addition (separate origin not sufficient). Use privileged RPCs only; no client writes to sensitive tables.

Consequences: Slightly more build complexity; stronger security posture.
