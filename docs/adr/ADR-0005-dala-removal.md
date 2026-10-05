# ADR-0005: Dala Removal Strategy

Status: Proposed
Date: 2026-10-04

Context: Remote image URLs, metadata, tracked junk files, and build artifacts reference Dala/Gebeya.

Decision: Copy 12 images to public/kba/media/ (preserve visuals), replace only those URLs, rewrite index.html metadata, rewrite README (fix mojibake), remove 0-byte tracked files and bun.lock, never do blind string replace of 'dala' outside the two permitted files (master prompt + removal log). dist/ regenerated clean.

Consequences: Local assets increase size slightly; reversible per commit.
