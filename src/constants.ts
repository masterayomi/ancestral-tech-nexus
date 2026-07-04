export const APP_NAME = 'Knowledge Bridge Africa'
export const APP_TAGLINE = 'Bridging indigenous wisdom and modern research across the continent.'

export const ROLES = [
  'Visitor',
  'Student',
  'Administrator',
  'Researcher',
  'Indigenous Knowledge Holder',
  'Translator',
  'Reviewer',
  'Moderator',
  'Institution Administrator',
  'National Administrator',
  'Super Administrator',
] as const

export type UserRole = (typeof ROLES)[number]

export const VERIFICATION_TYPES = [
  'Government',
  'University',
  'Community elder',
  'Research organization',
] as const

export const COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros',
  'Congo', "Cote d'Ivoire", 'Democratic Republic of the Congo', 'Djibouti',
  'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
  'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho',
  'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania',
  'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria',
  'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
  'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo',
  'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
]

export const NAV_ITEMS = [
  { id: 'strategy', label: 'Strategy' },
  { id: 'ia', label: 'Architecture' },
  { id: 'security', label: 'Security' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'model', label: 'Model' },
  { id: 'types', label: 'Types' },
  { id: 'graph', label: 'Graph' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'scalability', label: 'Scalability' },
  { id: 'governance', label: 'Governance' },
  { id: 'master', label: 'Reference' },
] as const

export const AUTH_LABELS = {
  signInTitle: 'Welcome back',
  signInSubtitle: 'Sign in to your Knowledge Bridge Africa account.',
  signUpTitle: 'Join the Bridge',
  signUpSubtitle: "Create your account and start contributing to Africa's knowledge ecosystem.",
  forgotPasswordTitle: 'Reset your password',
  forgotPasswordSubtitle: "Enter your email and we'll send you a reset link.",
  profileTab: 'Profile',
  verificationTab: 'Verification',
  preferencesTab: 'Preferences',
  auditTab: 'Audit Log',
  signOutLabel: 'Sign Out',
}

export const KNOWLEDGE_CATEGORIES = [
 'Medicinal Plants',
 'Agricultural Practices',
 'Ecological Knowledge',
 'Astronomy & Calendar',
 'Mathematics & Geometry',
 'Metallurgy & Materials',
 'Oral Traditions & Literature',
 'Music & Performance',
 'Visual Arts & Architecture',
 'Governance & Law',
 'Spiritual & Philosophical Systems',
 'Food & Nutrition',
 'Water Management',
 'Textile & Craft',
] as const

export const SCIENTIFIC_DISCIPLINES = [
 'Ethnobotany',
 'Pharmacology',
 'Ecology',
 'Anthropology',
 'Archaeology',
 'Linguistics',
 'Sociology',
 'Biology',
 'Chemistry',
 'Physics',
 'Geography',
 'Climate Science',
 'Agricultural Science',
 'Medicine',
] as const

export const EVIDENCE_LEVELS = [
 { level: 1, label: 'Emerging — anecdotal or single source' },
 { level: 2, label: 'Developing — multiple community sources' },
 { level: 3, label: 'Supported — community + preliminary research' },
 { level: 4, label: 'Strong — peer-reviewed + community validated' },
 { level: 5, label: 'Comprehensive — multi-disciplinary consensus' },
]

export const VALIDATION_STATUSES = [
 { value: 'draft', label: 'Draft', color: 'bg-stone-600' },
 { value: 'under_review', label: 'Under Review', color: 'bg-amber-600' },
 { value: 'revision_requested', label: 'Revision Requested', color: 'bg-orange-600' },
 { value: 'approved', label: 'Approved', color: 'bg-emerald-600' },
 { value: 'published', label: 'Published', color: 'bg-emerald-500' },
 { value: 'updated', label: 'Updated', color: 'bg-teal-600' },
 { value: 'archived', label: 'Archived', color: 'bg-slate-600' },
 { value: 'deprecated', label: 'Deprecated', color: 'bg-red-600' },
]

export const AFRICAN_REGIONS = [
 'West Africa',
 'East Africa',
 'Central Africa',
 'Southern Africa',
 'North Africa',
 'Horn of Africa',
 'Sahel',
 'Great Lakes',
 'Indian Ocean Islands',
] as const

export const KNOWLEDGE_REPO_CONSTANTS = {
 ERROR_LOADING: 'Failed to load knowledge objects.',
 PAGE_TITLE: 'Knowledge Repository',
 PAGE_SUBTITLE: 'Explore and contribute to the living archive of African indigenous knowledge — bridging ancestral wisdom with contemporary research.',
 CREATE_NEW: 'New Knowledge Object',
 SEARCH_PLACEHOLDER: 'Search by title, keyword, or community...',
 FILTERS_LABEL: 'Filters',
 CATEGORY_LABEL: 'All Categories',
 COUNTRY_LABEL: 'All Countries',
 REGION_LABEL: 'All Regions',
 EVIDENCE_LABEL: 'All Evidence Levels',
 STATUS_LABEL: 'All Statuses',
 CLEAR_FILTERS: 'Clear Filters',
 NO_RESULTS: 'No knowledge objects found.',
 NO_RESULTS_HINT: 'Try adjusting your filters or create a new entry.',
 BACK_TO_REPOSITORY: '← Back to Repository',
 INDIGENOUS_WISDOM: 'Indigenous Wisdom',
 SCIENTIFIC_CONTEXT: 'Scientific Context',
 DETAILS_TAB: 'Details',
 VERSIONS_TAB: 'Version History',
 RELATIONSHIPS_TAB: 'Relationships',
 VERSION_CURRENT: 'CURRENT',
 VERSION_RESTORE: 'Restore',
 CONFIRM_DELETE_TITLE: 'Archive this knowledge object?',
 CONFIRM_DELETE_DESC: 'This will soft-delete the object. It can be restored later by a moderator.',
 CANCEL: 'Cancel',
 CONFIRM: 'Confirm',
 CONFIRM_HARD_DELETE_TITLE: 'Permanently delete?',
 CONFIRM_HARD_DELETE_DESC: 'This action cannot be undone. All version history will also be removed.',
  EDIT_OBJECT: 'Edit Knowledge Object',
  NEW_OBJECT: 'New Knowledge Object',
  SAVE_DRAFT: 'Save as Draft',
  SUBMIT_REVIEW: 'Submit for Review',
  PUBLISH: 'Publish',
} as const
