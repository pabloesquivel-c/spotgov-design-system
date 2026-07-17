'use client';

// Settings v2 — interactive code prototype (/settings).
//
// A throwaway, self-contained preview route built from real AlignUI primitives,
// following the app/skeleton/page.tsx precedent: an isolated 'use client' page
// that composes existing components and mock data without touching production
// code, components/ui/, components/blocks/, or the manifest. Everything under
// _components/ is opted out of App Router routing by the underscore prefix.

import * as React from 'react';

import { AppSidebar } from '@/components/blocks/sidebar/app-sidebar';
import * as SegmentedControl from '@/components/ui/segmented-control';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';

import {
  ORG_SECTION_IDS,
  SettingsRail,
  type SectionId,
} from './_components/settings-rail';
import { DemoNote } from './_components/demo-note';
import { ProfileSection } from './_components/profile-section';
import { PreferencesSection } from './_components/preferences-section';
import { NotificationsSection } from './_components/notifications-section';
import { SecuritySection } from './_components/security-section';
import { GeneralSection } from './_components/general-section';
import { MembersSection } from './_components/members-section';
import { BusinessProfileSection } from './_components/business-profile-section';
import { IntegrationsSection } from './_components/integrations-section';
import { AnalysisTemplatesSection } from './_components/analysis-templates-section';
import { BillingSection } from './_components/billing-section';

type ViewerRole = 'owner-admin' | 'member';

// Sections that report unsaved-changes state up (Apply/Discard footer
// sections). Switching away from one of these while dirty is guarded by a
// confirm dialog, since the section unmounts on navigation and would
// otherwise silently drop the edit.
type PendingNav =
  | { type: 'section'; section: SectionId }
  | { type: 'role'; role: ViewerRole };

export default function SettingsPreviewPage() {
  const [activeSection, setActiveSection] =
    React.useState<SectionId>('profile');
  const [role, setRole] = React.useState<ViewerRole>('owner-admin');
  const [requested, setRequested] = React.useState(false);
  const [activeDirty, setActiveDirty] = React.useState(false);
  const [pendingNav, setPendingNav] = React.useState<PendingNav | null>(null);

  const orgLocked = role === 'member';

  const applyRoleChange = (next: ViewerRole) => {
    setRole(next);
    setRequested(false);
    // If access is revoked while viewing a locked Organization section, snap
    // back to the first Personal section — mirrors real client-side
    // permission gating. Members stays reachable (read-only), so it's exempt.
    if (
      next === 'member' &&
      ORG_SECTION_IDS.includes(activeSection) &&
      activeSection !== 'members'
    ) {
      setActiveSection('profile');
    }
  };

  const requestSectionChange = (id: SectionId) => {
    if (id === activeSection) return;
    if (activeDirty) {
      setPendingNav({ type: 'section', section: id });
      return;
    }
    setActiveSection(id);
  };

  const requestRoleChange = (next: ViewerRole) => {
    if (next === role) return;
    if (activeDirty) {
      setPendingNav({ type: 'role', role: next });
      return;
    }
    applyRoleChange(next);
  };

  const confirmDiscardNav = () => {
    if (!pendingNav) return;
    setActiveDirty(false);
    if (pendingNav.type === 'section') {
      setActiveSection(pendingNav.section);
    } else {
      applyRoleChange(pendingNav.role);
    }
    setPendingNav(null);
  };

  return (
    <div className='flex h-screen gap-4 bg-bg-weak-50 p-4'>
      {/* Decorative/mock global sidebar — reuses the real, already-interactive
          AppSidebar as-is; no changes needed to make it a preview mock. */}
      <AppSidebar defaultActiveKey='' />

      <div className='min-h-0 flex-1 overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0'>
        <div className='h-full overflow-y-auto'>
          <div className='mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-8'>
            {/* Header */}
            <header className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <h1 className='text-title-h6 text-text-strong-950'>Settings</h1>
                <p className='text-paragraph-sm text-text-sub-600'>
                  Manage your account and organization preferences.
                </p>
              </div>

              <div className='flex flex-col gap-1.5'>
                <span className='text-subheading-2xs uppercase text-text-soft-400'>
                  Preview as
                </span>
                <div className='w-[200px]'>
                  <SegmentedControl.Root
                    value={role}
                    onValueChange={(v) => requestRoleChange(v as ViewerRole)}
                  >
                    <SegmentedControl.List>
                      <SegmentedControl.Trigger value='owner-admin'>
                        Admin
                      </SegmentedControl.Trigger>
                      <SegmentedControl.Trigger value='member'>
                        Member
                      </SegmentedControl.Trigger>
                    </SegmentedControl.List>
                  </SegmentedControl.Root>
                </div>
                <DemoNote>
                  Switch to preview what a Member without organization access
                  sees. The Organization group locks behind a request-access
                  affordance.
                </DemoNote>
              </div>
            </header>

            {/* Two-column body */}
            <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
              <div className='lg:w-[224px] lg:shrink-0'>
                <SettingsRail
                  activeSection={activeSection}
                  onSectionChange={requestSectionChange}
                  orgLocked={orgLocked}
                  requested={requested}
                  onRequestAccess={() => setRequested(true)}
                />
              </div>

              <div className='min-w-0 flex-1'>
                <SectionContent
                  section={activeSection}
                  onNavigate={requestSectionChange}
                  onDirtyChange={setActiveDirty}
                  readOnlyMembers={orgLocked}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DestructiveConfirmModal
        open={pendingNav !== null}
        onOpenChange={(open) => !open && setPendingNav(null)}
        title='Discard unsaved changes?'
        description="You have unsaved changes in this section. Leaving now will discard them."
        confirmLabel='Discard changes'
        cancelLabel='Keep editing'
        onConfirm={confirmDiscardNav}
      />
    </div>
  );
}

function SectionContent({
  section,
  onNavigate,
  onDirtyChange,
  readOnlyMembers,
}: {
  section: SectionId;
  onNavigate: (id: SectionId) => void;
  onDirtyChange: (dirty: boolean) => void;
  readOnlyMembers: boolean;
}) {
  switch (section) {
    case 'profile':
      return <ProfileSection onDirtyChange={onDirtyChange} />;
    case 'preferences':
      return <PreferencesSection onDirtyChange={onDirtyChange} />;
    case 'notifications':
      return <NotificationsSection onDirtyChange={onDirtyChange} />;
    case 'security':
      return <SecuritySection />;
    case 'general':
      return (
        <GeneralSection onNavigate={onNavigate} onDirtyChange={onDirtyChange} />
      );
    case 'members':
      return <MembersSection readOnly={readOnlyMembers} />;
    case 'business-profile':
      return <BusinessProfileSection />;
    case 'integrations':
      return <IntegrationsSection />;
    case 'analysis-templates':
      return <AnalysisTemplatesSection />;
    case 'billing':
      return <BillingSection />;
    default:
      return null;
  }
}
