# ADR-0003: Evidence Model Expansion (R1+R2 now, R3+R4 deferred)

Status: Proposed
Date: 2026-10-04

Context: Current evidence is flat (evidence_level int + JSONB) — violates requirement to model claims/evidence/sources separately.

Decision: Add additive schema for claims, evidence_items, sources, claim_evidence, evidence_item_source, reviews (R1+R2). Preserve evidence_level and eference_links. Do not drop them until parity and backfill correctness verified (R3+R4 deferred).

Consequences: Dual-read path during transition; avoids data loss.
