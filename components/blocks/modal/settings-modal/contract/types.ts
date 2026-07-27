// Field routing contract (R11) — the seam between the Settings modal's
// presentational sections and a real backend adapter.
//
// Every section in ../sections/* currently owns local `useState` for its own
// draft/selection/dropdown state, wired directly against the mock data in
// this build (see settings-modal.tsx's docblock). None of them accept a
// `SettingsAdapter` yet — that prop-drilling refactor is the next pass. This
// file exists so the shape is agreed and typed *before* that refactor
// happens: a backend dev can implement `SettingsAdapter` against these types
// without opening a single layout file, and `mockSettingsAdapter` (once
// built from mock-data.ts) and the real adapter will satisfy the same type.
import type { ZodType } from 'zod';

export type MutationResult<T = void> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: 'validation' | 'forbidden' | 'conflict' | 'network' | 'unknown';
      message: string;
      fieldErrors?: { field: string; message: string }[];
    };

export type Mutation<TIn = void, TOut = void> = (
  input: TIn,
) => Promise<MutationResult<TOut>>;

/** Deferred-save form: one PATCH of dirty keys, driven by the shell footer. */
export type DeferredForm<TValues extends Record<string, unknown>> = {
  values: TValues; // server truth
  schema: ZodType<TValues>;
  save: Mutation<Partial<TValues>>; // patch semantics
  disabledFields?: readonly (keyof TValues)[]; // permission / plan gating
};

/** Live field: applies on change; adapter debounces and rolls back on error. */
export type LiveField<T> = { value: T; set: Mutation<T> };

export type Query<TItem, TParams> = {
  params: TParams;
  setParams: (patch: Partial<TParams>) => void; // adapter debounces, not the UI
  items: TItem[];
  total: number;
  status: 'idle' | 'loading' | 'error';
  error?: string;
  refetch: () => void;
};

/**
 * Section → shell bridge. Powers the footer, the section-switch dirty guard,
 * and the close guard. This is the runtime shape `SectionCommitHandle` in
 * settings-modal.tsx approximates today with plain `save`/`discard` — once a
 * section is wired to `DeferredForm`, `dirty`/`saving`/`invalid` should
 * derive from the form's own state instead of local component state.
 */
export type SectionCommit = {
  dirty: boolean;
  saving: boolean;
  invalid: boolean;
  save: () => void;
  discard: () => void;
};

export type Viewer = {
  id: string;
  role: 'owner' | 'admin' | 'member';
};

export type AccountSectionProps = {
  avatar: LiveField<string | null>;
  fullName: DeferredForm<{ fullName: string }>;
  email: string;
  onChangePassword: () => void;
  onManageTwoFactor: () => void;
};

export type PreferencesSectionProps = {
  language: LiveField<string>;
  theme: LiveField<'light' | 'dark' | 'system'>;
};

export type NotificationsSectionProps = {
  events: {
    id: string;
    label: string;
    description: string;
    enabled: LiveField<boolean>;
  }[];
  deadlineReminders: LiveField<boolean>;
  deadlineLeadDays: LiveField<1 | 3 | 7 | 14>;
};

export type CompanySectionProps = {
  logo: LiveField<string | null>;
  name: DeferredForm<{ name: string }>;
  language: DeferredForm<{ language: string }>;
  displayCurrency: DeferredForm<{ displayCurrency: string }>;
  onDeleteOrganization: (confirmedName: string) => Promise<MutationResult>;
};

export type TeamRow = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  canEditRole: boolean;
  canRemove: boolean;
};

export type TeamSectionProps = {
  roster: Query<
    TeamRow,
    {
      search: string;
      role: 'all' | 'admin' | 'member';
      status: 'all' | 'active' | 'pending';
    }
  >;
  seatLimit: number;
  setRole: Mutation<{ id: string; role: 'admin' | 'member' }>;
  remove: Mutation<{ id: string }>;
  invite: Mutation<{ emails: string[]; role: 'admin' | 'member' }>;
  resendInvite: Mutation<{ id: string }>;
  revokeInvite: Mutation<{ id: string }>;
};

export type IntegrationRow = {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'not-connected' | 'failed';
};

export type IntegrationsSectionProps = {
  integrations: IntegrationRow[];
  connect: Mutation<{ id: string; username: string; password: string }>;
  disconnect: Mutation<{ id: string }>;
  reconnect: Mutation<{ id: string }>;
};

export type TemplateRow = {
  id: string;
  name: string;
  question: string;
  active: boolean;
  isDefault: boolean;
};

export type TemplatesSectionProps = {
  templates: TemplateRow[];
  setActive: Mutation<{ id: string; active: boolean }>;
  create: Mutation<{ name: string; question: string }>;
  update: Mutation<{ id: string; name: string; question: string }>;
  delete: Mutation<{ id: string }>;
  reorder: Mutation<{ order: string[] }>;
  resetToDefaults: Mutation;
};

export type InvoiceRow = {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'due' | 'failed';
};

export type BillingSectionProps = {
  plan: {
    name: string;
    priceLabel: string;
    seatsUsed: number;
    seatsTotal: number;
  };
  onManagePlan: () => void;
  invoices: Query<
    InvoiceRow,
    { search: string; status: 'all' | 'paid' | 'due' | 'failed' }
  >;
  downloadInvoice: Mutation<{ id: string }>;
};

/** Business profile has no Figma frame (A10), so it ships as a placeholder. */
export type BusinessProfileSectionProps =
  | { status: 'not-designed'; onOpenFullPage: () => void }
  | {
      status: 'ready';
      legalName: DeferredForm<{ legalName: string }>;
      taxId: DeferredForm<{ taxId: string }>;
      registeredAddress: DeferredForm<{ registeredAddress: string }>;
      primarySector: DeferredForm<{ primarySector: string }>;
      certifications: LiveField<string[]>;
      licenses: LiveField<string[]>;
    };

/**
 * One hook per section so only the active section fetches — opening on
 * Account must not pull the Team roster or the Stripe invoice list.
 */
export type SettingsAdapter = {
  viewer: Viewer;
  useAccount: () => AccountSectionProps;
  usePreferences: () => PreferencesSectionProps;
  useNotifications: () => NotificationsSectionProps;
  useCompany: () => CompanySectionProps;
  useTeam: () => TeamSectionProps;
  useBusinessProfile: () => BusinessProfileSectionProps;
  useIntegrations: () => IntegrationsSectionProps;
  useTemplates: () => TemplatesSectionProps;
  useBilling: () => BillingSectionProps;
};
