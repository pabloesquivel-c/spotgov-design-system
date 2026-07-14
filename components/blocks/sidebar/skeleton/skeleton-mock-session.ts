// Mock "current session" data for the Skeleton sidebar preview.
//
// Nothing in this codebase has a real auth/session layer yet, so every
// user-settings-dependent value the sidebar renders (avatar, name, email,
// organization name/logo) is sourced from here rather than hardcoded inline.
// Swapping this for a real session fetch later should only require changing
// this file — every component below reads from a `Session` value passed in
// as a prop.

export type CurrentUser = {
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
};

export type CurrentOrg = {
  id: string;
  name: string;
  logoUrl?: string;
  initials: string;
};

export type Session = {
  user: CurrentUser;
  organizations: CurrentOrg[];
};

const pablo: CurrentUser = {
  name: 'Pablo Esquivel',
  email: 'pablo@acmecorp.com',
  initials: 'PE',
};

const acmeCorporation: CurrentOrg = {
  id: 'acme-corporation',
  name: 'Acme Corporation',
  initials: 'A',
};

const riversideConsulting: CurrentOrg = {
  id: 'riverside-consulting',
  name: 'Riverside Consulting',
  initials: 'R',
};

const northgatePartners: CurrentOrg = {
  id: 'northgate-partners',
  name: 'Northgate Partners',
  initials: 'N',
};

// ~91% of accounts belong to exactly one organization (per the PostHog data
// pulled during the design round) — this is the default preview session.
export const mockSessionSingleOrg: Session = {
  user: pablo,
  organizations: [acmeCorporation],
};

// The ~9% multi-org case — same user, several organizations to switch
// between. Used to preview the workspace row's interactive state.
export const mockSessionMultiOrg: Session = {
  user: pablo,
  organizations: [acmeCorporation, riversideConsulting, northgatePartners],
};
