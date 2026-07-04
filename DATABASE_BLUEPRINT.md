# Knowledge Bridge Africa: Database Blueprint

## 1. Database Architecture Overview

### Platform: Supabase (PostgreSQL)
Knowledge Bridge Africa utilizes Supabase as its primary persistence layer, leveraging PostgreSQL's robust relational capabilities combined with the `pgvector` extension for semantic AI retrieval. The architecture is designed for continental scale—supporting 10M+ knowledge records, 500+ institutions, and 54 sovereign nations.

### Design Principles
- **Federated Multi-Tenancy:** Each institution and nation operates within an isolated tenant space while contributing to the shared continental knowledge graph.
- **Dual-Integrity Storage:** Scientific data and indigenous knowledge are stored with equal structural priority, never subordinated.
- **Consent-First Architecture:** No indigenous knowledge record can exist in the database without a verified Prior Informed Consent (PIC) record.
- **Model-Agnostic Vectors:** Embeddings are stored separately from relational data, allowing LLM provider swaps without schema changes.

---

## 2. Core Schema: Knowledge Objects

### 2.1 `knowledge_objects` (The Core Knowledge Object — CKO v2.0)
The irreducible unit of information on the platform. Every article, oral history, research paper, and traditional practice is stored as a CKO.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Global canonical identifier |
| `tenant_id` | UUID | NOT NULL, FK → tenants.id | Institutional/national ownership |
| `title` | TEXT | NOT NULL | Primary name for indexing |
| `subtitle` | TEXT | | Descriptive secondary title |
| `summary` | TEXT | NOT NULL | Concise overview for AI retrieval |
| `full_description` | TEXT | | Extensive markdown documentation |
| `scientific_explanation` | TEXT | | Modern scientific context |
| `indigenous_knowledge` | TEXT | | Heritage-based wisdom and context |
| `practical_applications` | JSONB | DEFAULT '[]' | Real-world use cases array |
| `knowledge_type` | knowledge_type_enum | NOT NULL | Classification (see §2.2) |
| `domain` | domain_enum | NOT NULL | Primary domain (Agriculture, Healthcare, etc.) |
| `evidence_level` | INT | NOT NULL, CHECK (1-5) | Validation strength |
| `confidence_score` | FLOAT | NOT NULL, CHECK (0.0-1.0) | AI-calculated reliability |
| `source_quality` | FLOAT | CHECK (0.0-1.0) | Origin source reliability |
| `primary_language` | VARCHAR(10) | NOT NULL | ISO-639 language code |
| `geographic_coverage` | geographic_scope_enum | NOT NULL | Continental, Regional, Local |
| `countries` | VARCHAR(3)[] | | ISO-3166 country codes |
| `geo_coordinates` | JSONB | | GeoJSON spatial data |
| `scientific_discipline` | TEXT | | Academic field association |
| `traditional_category` | TEXT | | Indigenous knowledge domain |
| `status` | knowledge_status_enum | NOT NULL, DEFAULT 'draft' | Lifecycle state |
| `version` | VARCHAR(20) | NOT NULL, DEFAULT '1.0.0' | Semantic versioning |
| `license` | TEXT | NOT NULL | Usage rights and IP terms |
| `is_restricted` | BOOLEAN | DEFAULT false | Bio-piracy protection flag |
| `consent_record_id` | UUID | FK → consent_records.id | Mandatory PIC linkage |
| `created_by` | UUID | NOT NULL, FK → profiles.id | Original author |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last modification |
| `published_at` | TIMESTAMPTZ | | Publication timestamp |
| `deprecated_at` | TIMESTAMPTZ | | Deprecation timestamp |

**Indexes:**
- `idx_knowledge_objects_tenant` ON `knowledge_objects(tenant_id)`
- `idx_knowledge_objects_type` ON `knowledge_objects(knowledge_type)`
- `idx_knowledge_objects_domain` ON `knowledge_objects(domain)`
- `idx_knowledge_objects_status` ON `knowledge_objects(status)`
- `idx_knowledge_objects_language` ON `knowledge_objects(primary_language)`
- `idx_knowledge_objects_evidence` ON `knowledge_objects(evidence_level)`
- `idx_knowledge_objects_geo` ON `knowledge_objects` USING GIN (`geo_coordinates`)
- `idx_knowledge_objects_search` ON `knowledge_objects` USING GIN (to_tsvector('english', title || ' ' || summary))

---

### 2.2 Enumerated Types

```sql
-- Knowledge Type Classification (20+ types from the Knowledge Type System)
CREATE TYPE knowledge_type_enum AS ENUM (
  'scientific_concept', 'indigenous_practice', 'research_paper',
  'case_study', 'medicinal_plant', 'crop', 'animal_species',
  'agricultural_technique', 'engineering_method', 'architectural_practice',
  'innovation', 'scientific_experiment', 'historical_discovery',
  'environmental_observation', 'climate_adaptation_strategy',
  'educational_lesson', 'policy', 'dataset',
  'tool_or_technology', 'community_observation'
);

-- Primary Domain Classification (8 domains)
CREATE TYPE domain_enum AS ENUM (
  'agriculture', 'healthcare', 'science_and_theory',
  'engineering', 'heritage', 'governance',
  'education', 'innovation'
);

-- Knowledge Lifecycle States
CREATE TYPE knowledge_status_enum AS ENUM (
  'draft', 'under_review', 'revision_requested',
  'approved', 'published', 'updated',
  'archived', 'deprecated'
);

-- Geographic Scope
CREATE TYPE geographic_scope_enum AS ENUM (
  'continental', 'regional', 'national', 'local'
);

-- Relationship Types (The Bridge Graph Ontology)
CREATE TYPE relationship_type_enum AS ENUM (
  'supports', 'contradicts', 'expands', 'references',
  'is_similar_to', 'is_related_to', 'is_used_in',
  'is_derived_from', 'was_discovered_by', 'is_studied_by',
  'is_practiced_in', 'treats', 'prevents', 'causes',
  'improves', 'replaces', 'depends_on', 'influences',
  'is_translation_of'
);

-- User Roles (RBAC)
CREATE TYPE user_role_enum AS ENUM (
  'guest', 'student', 'researcher', 'elder',
  'moderator', 'admin'
);

-- Consent Status
CREATE TYPE consent_status_enum AS ENUM (
  'pending', 'granted', 'restricted', 'revoked'
);

-- Review Track Types
CREATE TYPE review_track_enum AS ENUM (
  'scientific', 'indigenous', 'language',
  'translation', 'evidence', 'editorial'
);
```

---

## 3. Knowledge Graph: Relationships

### 3.1 `knowledge_relationships` (The Bridge Graph)
Defines the semantic connections between knowledge objects, forming the continental knowledge graph.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Unique edge identifier |
| `source_object_id` | UUID | NOT NULL, FK → knowledge_objects.id | Origin node |
| `target_object_id` | UUID | NOT NULL, FK → knowledge_objects.id | Destination node |
| `relationship_type` | relationship_type_enum | NOT NULL | Type of semantic link |
| `confidence` | FLOAT | CHECK (0.0-1.0) | Strength of the relationship |
| `evidence_type` | TEXT | | How this relationship was established |
| `direction` | relationship_direction_enum | NOT NULL, DEFAULT 'directed' | Directed or bidirectional |
| `created_by` | UUID | FK → profiles.id | Who established this link |
| `verified_by` | UUID | FK → profiles.id | Who validated this link |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation time |

**Indexes:**
- `idx_relationships_source` ON `knowledge_relationships(source_object_id)`
- `idx_relationships_target` ON `knowledge_relationships(target_object_id)`
- `idx_relationships_type` ON `knowledge_relationships(relationship_type)`
- Composite unique constraint: `UNIQUE(source_object_id, target_object_id, relationship_type)`

---

## 4. Multi-Tenancy: Institutions & Nations

### 4.1 `tenants` (Institutional & National Spaces)
Each university, research institute, government body, and community organization operates within a tenant.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Tenant identifier |
| `name` | TEXT | NOT NULL | Institution/nation name |
| `tenant_type` | tenant_type_enum | NOT NULL | university, government, community, research_institute |
| `country_code` | VARCHAR(3) | NOT NULL | ISO-3166 alpha-3 |
| `region` | TEXT | | African region (East, West, Southern, etc.) |
| `is_sovereign` | BOOLEAN | DEFAULT false | Air-gapped/local deployment flag |
| `data_residency_policy` | TEXT | | Compliance framework (POPIA, NDPR, etc.) |
| `parent_tenant_id` | UUID | FK → tenants.id | For sub-departments |
| `metadata` | JSONB | DEFAULT '{}' | Flexible institutional attributes |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Registration time |
| `active` | BOOLEAN | DEFAULT true | Operational status |

### 4.2 Tenant Partitioning Strategy
For continental scale, the database implements **Row-Level Tenant Isolation**:
- Every query to `knowledge_objects` is automatically scoped by `tenant_id` via RLS policies.
- Federated search across tenants is enabled through a `search_across_tenants()` function that respects each tenant's sharing policies.
- Sovereign government tenants can deploy isolated Supabase instances that sync selectively via a conflict-resolution protocol.

---

## 5. User Management & RBAC

### 5.1 `profiles` (User Accounts)
Extends Supabase `auth.users` with platform-specific attributes.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY, FK → auth.users.id | Links to Supabase Auth |
| `role` | user_role_enum | NOT NULL, DEFAULT 'guest' | Platform role |
| `tenant_id` | UUID | FK → tenants.id | Primary institutional affiliation |
| `display_name` | TEXT | NOT NULL | Public name |
| `avatar_url` | TEXT | | Profile image |
| `languages` | VARCHAR(10)[] | | Spoken languages |
| `is_verified` | BOOLEAN | DEFAULT false | Verification status |
| `verification_type` | TEXT | | academic, elder_nomination, community |
| `reputation_score` | FLOAT | DEFAULT 0.0 | Decentralized reputation |
| `bio` | TEXT | | Short biography |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Account creation |

### 5.2 `user_tenant_memberships`
Users can belong to multiple institutions (e.g., a researcher affiliated with two universities).

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Membership identifier |
| `user_id` | UUID | NOT NULL, FK → profiles.id | User reference |
| `tenant_id` | UUID | NOT NULL, FK → tenants.id | Institution reference |
| `role_in_tenant` | TEXT | | Specific role within the institution |
| `joined_at` | TIMESTAMPTZ | DEFAULT now() | Membership start |

**Unique Constraint:** `UNIQUE(user_id, tenant_id)`

---

## 6. Consent & Bio-Piracy Prevention

### 6.1 `consent_records` (Prior Informed Consent — PIC)
Every indigenous knowledge object MUST have a linked consent record. This is the ethical backbone of the platform.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Consent record identifier |
| `knowledge_object_id` | UUID | FK → knowledge_objects.id | Linked knowledge |
| `community_name` | TEXT | NOT NULL | Name of the knowledge-holding community |
| `custodian_id` | UUID | FK → profiles.id | Elder/guardian who granted consent |
| `consent_status` | consent_status_enum | NOT NULL | Current consent state |
| `consent_type` | TEXT | | full, partial, educational_only, research_only |
| `restrictions` | JSONB | DEFAULT '{}' | Specific usage limitations |
| `consent_document_url` | TEXT | | URL to signed/recorded consent |
| `consent_audio_url` | TEXT | | Oral consent recording |
| `granted_at` | TIMESTAMPTZ | | When consent was given |
| `revoked_at` | TIMESTAMPTZ | | If/when consent was revoked |
| `review_date` | TIMESTAMPTZ | | Periodic re-verification date |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Record creation |

**Critical Rule:** If `consent_status` = 'revoked', the corresponding `knowledge_objects` record must be automatically purged from all vector indexes and search results via a database trigger.

---

## 7. Governance: Reviews & Versioning

### 7.1 `review_records`
Tracks the multi-layered review workflow (Scientific, Indigenous, Language, Translation, Evidence, Editorial).

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Review identifier |
| `knowledge_object_id` | UUID | NOT NULL, FK → knowledge_objects.id | Object under review |
| `review_track` | review_track_enum | NOT NULL | Type of review |
| `reviewer_id` | UUID | NOT NULL, FK → profiles.id | Who performed the review |
| `status` | review_status_enum | NOT NULL | pending, approved, rejected, revision_requested |
| `comments` | TEXT | | Reviewer feedback |
| `evidence_provided` | JSONB | | Supporting documentation |
| `reviewed_at` | TIMESTAMPTZ | | Review completion time |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Review initiation |

### 7.2 `knowledge_versions`
Immutable audit trail for every change to a knowledge object.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Version identifier |
| `knowledge_object_id` | UUID | NOT NULL, FK → knowledge_objects.id | Parent object |
| `version_number` | VARCHAR(20) | NOT NULL | Semantic version |
| `change_summary` | TEXT | | What changed |
| `diff_snapshot` | JSONB | | Full state at this version |
| `changed_by` | UUID | FK → profiles.id | Who made the change |
| `change_type` | TEXT | | minor, major, correction |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Version timestamp |

---

## 8. AI & Vector Storage

### 8.1 `knowledge_embeddings`
Stores vector representations for semantic search and RAG retrieval. Separated from relational data to support model-agnostic switching.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Embedding identifier |
| `knowledge_object_id` | UUID | NOT NULL, FK → knowledge_objects.id | Linked knowledge |
| `model_name` | TEXT | NOT NULL | Embedding model used (e.g., 'text-embedding-3-small') |
| `embedding` | vector(1536) | NOT NULL | The vector representation |
| `chunk_index` | INT | DEFAULT 0 | For multi-chunk documents |
| `language` | VARCHAR(10) | | Language of this chunk |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Generation time |

**Indexes:**
- `idx_embeddings_vector` ON `knowledge_embeddings` USING ivfflat (`embedding` vector_cosine_ops) WITH (lists = 100)
- `idx_embeddings_object` ON `knowledge_embeddings(knowledge_object_id)`
- `idx_embeddings_model` ON `knowledge_embeddings(model_name)`

**Model Agnosticism:** When switching embedding providers, new vectors are generated with the new `model_name`. Old vectors are retained until validation is complete, then archived. The relational schema and governance logic remain untouched.

---

## 9. Attribution & Reputation

### 9.1 `contributions`
Tracks every contributor to a knowledge object with weighted attribution.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Contribution identifier |
| `knowledge_object_id` | UUID | NOT NULL, FK → knowledge_objects.id | Linked knowledge |
| `contributor_id` | UUID | NOT NULL, FK → profiles.id | Who contributed |
| `contribution_type` | TEXT | NOT NULL | author, reviewer, translator, elder_validator, community |
| `attribution_weight` | FLOAT | DEFAULT 1.0 | Relative credit |
| `is_public` | BOOLEAN | DEFAULT true | Visibility of attribution |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Contribution time |

### 9.2 `reputation_events`
Decentralized reputation tracking based on validation accuracy and community engagement.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Event identifier |
| `user_id` | UUID | NOT NULL, FK → profiles.id | User earning reputation |
| `event_type` | TEXT | NOT NULL | validation, peer_review, community_endorsement, citation |
| `points` | FLOAT | NOT NULL | Reputation change |
| `source_object_id` | UUID | FK → knowledge_objects.id | Related knowledge |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Event time |

---

## 10. Row Level Security (RLS) Strategy

### Current Phase: Documentation (no_auth_public_read)
During the design phase, RLS policies are documented but not yet enforced. When Phase 3 (Database & Auth) begins, the following policies will be activated:

### 10.1 Knowledge Objects RLS
```sql
-- Enable RLS
ALTER TABLE knowledge_objects ENABLE ROW LEVEL SECURITY;

-- Public read for published, non-restricted objects
CREATE POLICY "Public can read published knowledge"
ON knowledge_objects FOR SELECT
USING (status = 'published' AND is_restricted = false);

-- Tenant members can read their institution's objects
CREATE POLICY "Tenant members read own tenant objects"
ON knowledge_objects FOR SELECT
USING (tenant_id IN (
  SELECT tenant_id FROM user_tenant_memberships WHERE user_id = auth.uid()
));

-- Verified researchers can create objects
CREATE POLICY "Verified users can create knowledge"
ON knowledge_objects FOR INSERT
WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_verified = true));

-- Authors can update their own drafts
CREATE POLICY "Authors can update own drafts"
ON knowledge_objects FOR UPDATE
USING (created_by = auth.uid() AND status = 'draft');

-- Restricted objects require explicit consent verification
CREATE POLICY "Restricted objects need consent check"
ON knowledge_objects FOR SELECT
USING (
  is_restricted = false
  OR
  (is_restricted = true AND consent_record_id IN (
    SELECT id FROM consent_records WHERE consent_status = 'granted'
    AND consent_type = 'full'
  ))
);
```

### 10.2 Consent Records RLS
```sql
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Custodians can manage their own consent records
CREATE POLICY "Custodians manage own consent"
ON consent_records FOR ALL
USING (custodian_id = auth.uid());

-- Public can verify consent exists (but not see details)
CREATE POLICY "Public can verify consent existence"
ON consent_records FOR SELECT
USING (consent_status = 'granted');
```

### 10.3 Tenant Isolation RLS
```sql
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- All authenticated users can see active tenants
CREATE POLICY "Authenticated users see active tenants"
ON tenants FOR SELECT
USING (active = true AND auth.role() = 'authenticated');

-- Only admins can modify tenant configurations
CREATE POLICY "Admins manage tenants"
ON tenants FOR ALL
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

---

## 11. Scalability & Performance

### 11.1 Partitioning Strategy
For 10M+ records, the `knowledge_objects` table will be partitioned by `domain`:
```sql
-- Range partition by domain for query optimization
CREATE TABLE knowledge_objects (
  -- ... columns ...
) PARTITION BY LIST (domain);

CREATE TABLE ko_agriculture PARTITION OF knowledge_objects FOR VALUES IN ('agriculture');
CREATE TABLE ko_healthcare PARTITION OF knowledge_objects FOR VALUES IN ('healthcare');
CREATE TABLE ko_science PARTITION OF knowledge_objects FOR VALUES IN ('science_and_theory');
-- ... etc for each domain
```

### 11.2 Vector Index Strategy
- **Hot Data:** IVFFlat index on `knowledge_embeddings` for frequently accessed vectors.
- **Cold Data:** Archived vectors stored in Supabase Storage as serialized arrays.
- **Incremental Updates:** Micro-batch embedding regeneration when models change.

### 11.3 Federated Search
A PostgreSQL function enables cross-tenant search while respecting sharing policies:
```sql
CREATE OR REPLACE FUNCTION search_across_tenants(
  query_text TEXT,
  requesting_user_id UUID,
  limit_results INT DEFAULT 50
) RETURNS SETOF knowledge_objects
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ko.* FROM knowledge_objects ko
  WHERE ko.status = 'published'
    AND ko.is_restricted = false
    AND (
      ko.tenant_id IN (
        SELECT tenant_id FROM user_tenant_memberships WHERE user_id = requesting_user_id
      )
      OR ko.tenant_id IN (
        SELECT id FROM tenants WHERE metadata->>'sharing_policy' = 'open'
      )
    )
  LIMIT limit_results;
END;
$$;
```

---

## 12. Data Sovereignty & Compliance

### 12.1 Regional Data Residency
Government tenants can enforce data residency requirements:
- **South Africa (POPIA):** Personal data must remain on South African soil.
- **Nigeria (NDPR):** Government knowledge objects stored in Nigerian jurisdiction.
- **Kenya (DPA):** Health-related knowledge requires local encryption keys.

### 12.2 Sovereign Deployment Model
For air-gapped government instances:
- A local Supabase instance runs within the nation's infrastructure.
- A sync protocol selectively shares non-sensitive, published knowledge to the continental hub.
- Conflict resolution uses timestamp-based last-write-wins with manual override for disputes.

---

## 13. Migration & Deployment Sequence

### Phase 3 Implementation Order:
1. **Core Tables:** `tenants`, `profiles`, `knowledge_objects`
2. **Graph Layer:** `knowledge_relationships`
3. **Governance:** `consent_records`, `review_records`, `knowledge_versions`
4. **AI Layer:** `knowledge_embeddings` (with pgvector)
5. **Attribution:** `contributions`, `reputation_events`
6. **RLS Policies:** Activated after auth integration
7. **Partitioning:** Applied after initial data load
8. **Functions:** Federated search and consent-purge triggers

---

## 14. Single Source of Truth

This Database Blueprint is the authoritative specification for all persistence-layer decisions in Knowledge Bridge Africa. Every migration, edge function, and API endpoint must align with these schemas. No table shall be created without a corresponding entry in this document.

**Version:** 1.0
**Status:** Design Complete — Awaiting Phase 3 Implementation
**Alignment:** Master Blueprint v1.0, CKO v2.0, Knowledge Type System v1.4, Governance Trust Protocol v4.0
