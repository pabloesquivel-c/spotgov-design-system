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

import {
  ORG_SECTION_IDS,
  SettingsRail,
  type SectionId,
} from './_components/settings-rail';
import { DemoNote } from './_components/demo-note';
import { ProfileSection } from './_components/profile-section';
import { PreferencesSection } from './_components/preferences-section';
import { NotificationsSection } from './_components/notifications-section';
import { GeneralSection } from './_components/general-section';
import { MembersSection } from './_components/members-section';
import { BusinessProfileSection } from './_components/business-profile-section';
import { IntegrationsSection } from './_components/integrations-section';
import { AnalysisTemplatesSection } from './_components/analysis-templates-section';

type ViewerRole = 'owner-admin' | 'member';

export default function SettingsPreviewPage() {
  const [activeSection, setActiveSection] =
    React.useState<SectionId>('profile');
  const [role, setRole] = React.useState<ViewerRole>('owner-admin');
  const [requested, setRequested] = React.useState(false);

  const orgLocked = role === 'member';

  const handleRoleChange = (next: ViewerRole) => {
    setRole(next);
    setRequested(false);
    // If access is revoked while viewing an Organization section, snap back to
    // the first Personal section — mirrors real client-side permission gating.
    if (next === 'member' && ORG_SECTION_IDS.includes(activeSection)) {
      setActiveSection('profile');
    }
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
                    onValueChange={(v) => handleRoleChange(v as ViewerRole)}
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
                  onSectionChange={setActiveSection}
                  orgLocked={orgLocked}
                  requested={requested}
                  onRequestAccess={() => setRequested(true)}
                />
              </div>

              <div className='min-w-0 flex-1'>
                <SectionContent
                  section={activeSection}
                  onNavigate={setActiveSection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionContent({
  section,
  onNavigate,
}: {
  section: SectionId;
  onNavigate: (id: SectionId) => void;
}) {
  switch (section) {
    case 'profile':
      return <ProfileSection />;
    case 'preferences':
      return <PreferencesSection />;
    case 'notifications':
      return <NotificationsSection />;
    case 'general':
      return <GeneralSection onNavigate={onNavigate} />;
    case 'members':
      return <MembersSection />;
    case 'business-profile':
      return <BusinessProfileSection />;
    case 'integrations':
      return <IntegrationsSection />;
    case 'analysis-templates':
      return <AnalysisTemplatesSection />;
    default:
      return null;
  }
}
