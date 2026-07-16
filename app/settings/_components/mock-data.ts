// Mock data for the Settings v2 interactive prototype (`/settings`).
//
// This is throwaway demo data for a self-contained preview route — it is NOT a
// production data model. It reuses `mockSessionSingleOrg` (Pablo Esquivel /
// Acme Corporation) for the account owner so the prototype lines up with the
// Skeleton sidebar preview instead of inventing a second identity.

import { mockSessionSingleOrg } from '@/components/blocks/sidebar/skeleton/skeleton-mock-session';

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

export type TemplateLanguage = 'EN' | 'PT';

export type AnalysisTemplate = {
  id: string;
  name: string;
  language: TemplateLanguage;
  active: boolean;
  question: string;
};

export const DEFAULT_TEMPLATES: AnalysisTemplate[] = [
  {
    id: 'standard-review',
    name: 'Standard Review',
    language: 'EN',
    active: true,
    question:
      'Summarise the scope, eligibility requirements, and submission deadline. Flag any mandatory certifications the bidder must hold.',
  },
  {
    id: 'compliance-check',
    name: 'Compliance Check',
    language: 'EN',
    active: true,
    question:
      'List every compliance clause in the tender and note which supporting documents are required to satisfy each one.',
  },
  {
    id: 'revisao-padrao',
    name: 'Revisão Padrão',
    language: 'PT',
    active: false,
    question:
      'Resuma o objeto do concurso, os critérios de adjudicação e o prazo de entrega das propostas. Assinale requisitos obrigatórios.',
  },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
};

export const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'analysis-completed',
    label: 'Analysis Completed',
    description: 'When an analysis you started finishes running.',
    defaultOn: true,
  },
  {
    id: 'in-a-comment',
    label: 'In a Comment',
    description: 'When someone mentions you in a comment.',
    defaultOn: true,
  },
  {
    id: 'in-a-tender-note',
    label: 'In a Tender Note',
    description: 'When someone mentions you in a tender note.',
    defaultOn: false,
  },
  {
    id: 'in-an-analysis',
    label: 'In an Analysis',
    description: 'When someone mentions you inside an analysis.',
    defaultOn: true,
  },
];
