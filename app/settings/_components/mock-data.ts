// Mock data for the Settings v2 interactive prototype (`/settings`).
//
// This is throwaway demo data for a self-contained preview route — it is NOT a
// production data model. It reuses `mockSessionSingleOrg` (Pablo Esquivel /
// Acme Corporation) for the account owner so the prototype lines up with the
// Skeleton sidebar preview instead of inventing a second identity.

import { mockSessionSingleOrg } from '@/components/blocks/sidebar/skeleton/skeleton-mock-session';

/* ------------------------------------------------------------------ */
/* Organization identity                                               */
/* ------------------------------------------------------------------ */

export const ORG_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
];

export const DEFAULT_ORG = {
  name: 'Acme Corporation',
  language: 'en',
};

/* ------------------------------------------------------------------ */
/* Members                                                             */
/* ------------------------------------------------------------------ */

export type MemberRole = 'owner' | 'admin' | 'member';
export type MemberStatus = 'active' | 'pending';
export type AvatarColor = 'gray' | 'blue' | 'purple' | 'sky' | 'yellow' | 'red';

export type Member = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: MemberRole;
  status: MemberStatus;
  color: AvatarColor;
  /** Pending invites only — days until the invite link expires. */
  expiresInDays?: number;
};

const owner = mockSessionSingleOrg.user;

// The at-rest roster the Paper design was drawn against: one owner, one admin,
// three members, one pending invite = 6 people. Kept intentionally small so
// the default view matches the design; the "Simulate larger team" toggle swaps
// in `LARGE_MEMBERS` to exercise the paginated / at-scale states.
export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'owner',
    name: owner.name,
    email: owner.email,
    initials: owner.initials,
    role: 'owner',
    status: 'active',
    color: 'gray',
  },
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    email: 'sarah@acmecorp.com',
    initials: 'SC',
    role: 'admin',
    status: 'active',
    color: 'purple',
  },
  {
    id: 'james-wright',
    name: 'James Wright',
    email: 'james@acmecorp.com',
    initials: 'JW',
    role: 'member',
    status: 'active',
    color: 'blue',
  },
  {
    id: 'maria-lopez',
    name: 'Maria Lopez',
    email: 'maria@acmecorp.com',
    initials: 'ML',
    role: 'member',
    status: 'active',
    color: 'sky',
  },
  {
    id: 'ana-ferreira',
    name: 'Ana Ferreira',
    email: 'ana@acmecorp.com',
    initials: 'AF',
    role: 'member',
    status: 'active',
    color: 'yellow',
  },
  {
    id: 'invite-david',
    name: 'david@partnerfirm.com',
    email: 'david@partnerfirm.com',
    initials: 'D',
    role: 'member',
    status: 'pending',
    color: 'gray',
    expiresInDays: 5,
  },
];

// A realistic ~22-person roster spread across roles + pending invites, used by
// the "Simulate larger team" demo control so Pagination actually pages through
// different people. Generated statically (no Math.random — keeps SSR stable).
const AVATAR_COLORS: AvatarColor[] = [
  'gray',
  'blue',
  'purple',
  'sky',
  'yellow',
  'red',
];

const EXTRA_NAMES = [
  'Tom Becker',
  'Priya Nair',
  'Daniel Osei',
  'Sofia Rossi',
  'Liam Murphy',
  'Chloe Dubois',
  'Marcus Reyes',
  'Elena Petrova',
  'Noah Fischer',
  'Yuki Tanaka',
  'Omar Haddad',
  'Grace Kim',
  'Lucas Costa',
  'Hannah Berg',
  'Diego Silva',
  'Aisha Khan',
];

function initialsFor(name: string) {
  const parts = name.split(' ');
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export const LARGE_MEMBERS: Member[] = [
  DEFAULT_MEMBERS[0], // owner
  DEFAULT_MEMBERS[1], // Sarah Chen (admin)
  {
    id: 'nina-alvarez',
    name: 'Nina Alvarez',
    email: 'nina@acmecorp.com',
    initials: 'NA',
    role: 'admin',
    status: 'active',
    color: 'red',
  },
  ...EXTRA_NAMES.map((name, i): Member => {
    const first = name.split(' ')[0].toLowerCase();
    // last four are pending invites; the rest are active members
    const pending = i >= EXTRA_NAMES.length - 4;
    return {
      id: `gen-${i}`,
      name: pending ? `${first}@acmecorp.com` : name,
      email: `${first}@acmecorp.com`,
      initials: pending ? first[0].toUpperCase() : initialsFor(name),
      role: 'member',
      status: pending ? 'pending' : 'active',
      color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      expiresInDays: pending ? [7, 3, 1, 6][i % 4] : undefined,
    };
  }),
  DEFAULT_MEMBERS[2],
  DEFAULT_MEMBERS[3],
  DEFAULT_MEMBERS[4],
];

export const MEMBER_ROLE_LABEL: Record<MemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

/* ------------------------------------------------------------------ */
/* Integrations                                                        */
/* ------------------------------------------------------------------ */

export type IntegrationStatus = 'connected' | 'not-connected' | 'failed';

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
};

export const DEFAULT_INTEGRATIONS: Integration[] = [
  {
    id: 'vortal',
    name: 'Vortal',
    description: 'Sync tender notices and submissions from Vortal.',
    status: 'connected',
  },
  {
    id: 'acingov',
    name: 'AcinGov',
    description: 'Import opportunities published on the AcinGov platform.',
    status: 'not-connected',
  },
];

/* ------------------------------------------------------------------ */
/* Analysis templates                                                  */
/* ------------------------------------------------------------------ */

export type AnalysisTemplate = {
  id: string;
  name: string;
  active: boolean;
  question: string;
};

export const DEFAULT_TEMPLATES: AnalysisTemplate[] = [
  {
    id: 'standard-review',
    name: 'Standard Review',
    active: true,
    question:
      'Summarise the scope, eligibility requirements, and submission deadline. Flag any mandatory certifications the bidder must hold.',
  },
  {
    id: 'compliance-check',
    name: 'Compliance Check',
    active: true,
    question:
      'List every compliance clause in the tender and note which supporting documents are required to satisfy each one.',
  },
  {
    id: 'deadline-scope',
    name: 'Deadline & Scope',
    active: false,
    question:
      'Identify the submission deadline, scope of work, and any milestone dates the bidder must plan around.',
  },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export type NotificationGroup = 'activity' | 'mentions' | 'tenders';

export type NotificationChannels = { inApp: boolean; email: boolean };

export type NotificationSetting = {
  id: string;
  group: NotificationGroup;
  label: string;
  description: string;
  defaultChannels: NotificationChannels;
};

export type TenderNotificationPrefs = {
  deadlineLeadDays: number[];
  dailyDigest: boolean;
};

export const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'analysis-completed',
    group: 'activity',
    label: 'Analysis Completed',
    description: 'Notify me when a reviewer finishes an analysis.',
    defaultChannels: { inApp: true, email: true },
  },
  {
    id: 'in-a-comment',
    group: 'mentions',
    label: 'In a Comment',
    description: 'Someone @mentions you on a tender or contract.',
    defaultChannels: { inApp: true, email: true },
  },
  {
    id: 'in-a-tender-note',
    group: 'mentions',
    label: 'In a Tender Note',
    description: 'Someone @mentions you in a shared note.',
    defaultChannels: { inApp: false, email: false },
  },
  {
    id: 'in-an-analysis',
    group: 'mentions',
    label: 'In an Analysis',
    description: 'Someone @mentions you in an AI analysis thread.',
    defaultChannels: { inApp: true, email: false },
  },
  {
    id: 'deadline-approaching',
    group: 'tenders',
    label: 'Deadline Approaching',
    description: "A tracked tender's submission deadline is coming up.",
    defaultChannels: { inApp: true, email: true },
  },
  {
    id: 'new-matching-tender',
    group: 'tenders',
    label: 'New Matching Tender',
    description: 'A new tender matches your saved search criteria.',
    defaultChannels: { inApp: true, email: false },
  },
  {
    id: 'award-published',
    group: 'tenders',
    label: 'Award Published',
    description: 'The award decision for a tracked tender is published.',
    defaultChannels: { inApp: true, email: true },
  },
];

export const DEFAULT_TENDER_NOTIFICATION_PREFS: TenderNotificationPrefs = {
  deadlineLeadDays: [3, 1],
  dailyDigest: false,
};

/* ------------------------------------------------------------------ */
/* Billing                                                             */
/* ------------------------------------------------------------------ */

export type BillingPlan = {
  name: string;
  price: string;
  seatsUsed: number;
  seatsTotal: number;
};

export const DEFAULT_BILLING_PLAN: BillingPlan = {
  name: 'Team',
  price: '$49 / seat / month',
  seatsUsed: 6,
  seatsTotal: 8,
};

export type PaymentMethod = {
  brand: string;
  last4: string;
  expiry: string;
};

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = {
  brand: 'Visa',
  last4: '4242',
  expiry: '08/27',
};

export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'due';
};

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2026-006', date: 'Jun 1, 2026', amount: '$294.00', status: 'paid' },
  { id: 'INV-2026-005', date: 'May 1, 2026', amount: '$294.00', status: 'paid' },
  { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '$245.00', status: 'paid' },
];

/* ------------------------------------------------------------------ */
/* Security                                                            */
/* ------------------------------------------------------------------ */

export type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export const DEFAULT_SESSIONS: Session[] = [
  {
    id: 'current',
    device: 'Chrome on macOS',
    location: 'São Paulo, Brazil',
    lastActive: 'Active now',
    current: true,
  },
  {
    id: 'mobile',
    device: 'Safari on iPhone',
    location: 'São Paulo, Brazil',
    lastActive: '2 hours ago',
    current: false,
  },
];
