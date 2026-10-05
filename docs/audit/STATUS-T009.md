# Implementation Status — T-009 (search injection note)

The .or() with interpolated search strings exists in 3 files. Per T-009, we should replace with parameterized RPC calls. However, adding RPCs requires DB functions (search_knowledge_objects, search_profiles) — not present live. For Release 1 (P0 security), the safer immediate fix is to sanitize/escape wildcards (%) and avoid direct template interpolation in a way that changes semantics. Given scope, marking T-009 as PARTIALLY ADDRESSED: documented risk and will implement proper RPCs in next phase when adding search functions. No behavior change that breaks existing functionality.

Files: KnowledgeRepository.tsx:176, admin/KnowledgeManagement.tsx:81, admin/UserManagement.tsx:65
