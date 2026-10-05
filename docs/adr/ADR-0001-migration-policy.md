# ADR-0001: Migration Policy (Additive-Only Until Verified)

Status: Proposed
Date: 2026-10-04

Context: Only one patch migration exists; base schema unknown. Avoid destructive operations.

Decision: All migrations are additive (IF NOT EXISTS, CREATE OR REPLACE only where safe). No DROP TABLE, no broad DELETE, no column type changes without verification. Until T-001 completes, no DDL changes to live schema shape beyond reading.

Consequences: Safer rollout, easier rollback. Requires baseline capture first.
