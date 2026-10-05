/**
 * Search term sanitisation for PostgREST filter strings.
 *
 * Supabase's query builder interpolates values into a PostgREST filter
 * expression, so a raw user-supplied term can terminate the intended
 * condition and append its own (`,`) or change the operator (`.`). That lets a
 * caller rewrite the query it was meant to be a free-text search within, which
 * is not a privilege escalation - RLS still applies - but it does defeat the
 * fixed constraints the caller built around the search, such as the
 * `is_deleted = false` filter in the repository listing.
 *
 * The fix is to strip the characters that carry structure in PostgREST and keep
 * only those that are meaningful in a search term. `%` and `_` are deliberately
 * preserved so wildcard search keeps working.
 */

const STRUCTURAL_CHARS = /[,."'()\\]/g;

const MAX_SEARCH_LENGTH = 100;

export function sanitizeSearchTerm(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(STRUCTURAL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SEARCH_LENGTH);
}

/**
 * True when the sanitised term is still worth sending to the database.
 */
export function hasSearchTerm(raw: string | null | undefined): boolean {
  return sanitizeSearchTerm(raw).length > 0;
}