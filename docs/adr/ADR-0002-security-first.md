# ADR-0002: Security-First — Fix P0 Escalations Before Features

Status: Proposed
Date: 2026-10-04

Context: Three privilege-escalation paths identified in current RLS/policies and UI.

Decision: Implement T-002–T-011 (Phase 8) before feature work. Close user_roles write, guard profiles.role, restrict knowledge_versions INSERT, define RLS for the 4 unknown tables, introduce admin_capabilities, remove client-side role changes, kill .or() injection vectors, enforce server-side lifecycle, and move to server-generated audit.

Consequences: Breaks self-promotion immediately (intentional). Requires RPCs for admin operations.
