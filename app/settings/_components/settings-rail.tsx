'use client';

// Two-group vertical settings nav (Personal / Organization), built on
// TabMenuVertical. Controlled by a single `activeSection` value at the page
// level. The uppercase group labels are plain <div>s interspersed between the
// Radix triggers (Tabs.List tolerates non-trigger children).
//
// Locked-organization simulation: when the viewer is previewing as a "Member"
// (`orgLocked`), the 5 Organization triggers get Radix's native `disabled`, and
// the group header swaps to a padlock + "Visible to admins only" + a
// Request access link that flips to "Requested" on click — reusing both
// designed variants of the Shell's core interaction as one real control.

import {
  RiBriefcaseLine,
  RiCheckLine,
  RiEqualizer2Line,
  RiFileTextLine,
  RiLockLine,
  RiNotification3Line,
  RiPlugLine,
  RiSettings3Line,
  RiTeamLine,
  RiUserLine,
  type RemixiconComponentType,
} from '@remixicon/react';

import * as TabMenuVertical from '@/components/ui/tab-menu-vertical';
import { cn } from '@/utils/cn';

export type SectionId =
  | 'profile'
  | 'preferences'
  | 'notifications'
  | 'general'
  | 'members'
  | 'business-profile'
  | 'integrations'
  | 'analysis-templates';

type SectionDef = { id: SectionId; label: string; icon: RemixiconComponentType };

export const PERSONAL_SECTIONS: SectionDef[] = [
  { id: 'profile', label: 'Profile', icon: RiUserLine },
  { id: 'preferences', label: 'Preferences', icon: RiEqualizer2Line },
  { id: 'notifications', label: 'Notifications', icon: RiNotification3Line },
];

export const ORG_SECTIONS: SectionDef[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'business-profile', label: 'Business Profile', icon: RiBriefcaseLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'analysis-templates', label: 'Analysis Templates', icon: RiFileTextLine },
];

export const ORG_SECTION_IDS = ORG_SECTIONS.map((s) => s.id);

export type SettingsRailProps = {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  orgLocked: boolean;
  requested: boolean;
  onRequestAccess: () => void;
};

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-2 pb-1 pt-1 text-subheading-xs uppercase text-text-soft-400'>
      {children}
    </div>
  );
}

function SectionTrigger({ section }: { section: SectionDef }) {
  const Icon = section.icon;
  return (
    <TabMenuVertical.Trigger value={section.id}>
      <TabMenuVertical.Icon as={Icon} />
      <span>{section.label}</span>
    </TabMenuVertical.Trigger>
  );
}

export function SettingsRail({
  activeSection,
  onSectionChange,
  orgLocked,
  requested,
  onRequestAccess,
}: SettingsRailProps) {
  return (
    <TabMenuVertical.Root
      value={activeSection}
      onValueChange={(v) => onSectionChange(v as SectionId)}
    >
      <TabMenuVertical.List className='space-y-1'>
        <GroupLabel>Personal</GroupLabel>
        {PERSONAL_SECTIONS.map((section) => (
          <SectionTrigger key={section.id} section={section} />
        ))}

        {/* Organization group header — locks when previewing as a Member */}
        <div className='pt-4'>
          {orgLocked ? (
            <div className='flex flex-col gap-1 px-2 pb-1'>
              <div className='flex items-center gap-1 text-subheading-xs uppercase text-text-soft-400'>
                <RiLockLine className='size-3.5' aria-hidden='true' />
                <span>Organization</span>
              </div>
              <span className='text-paragraph-xs text-text-sub-600'>
                Visible to admins only
              </span>
              {requested ? (
                <span className='flex items-center gap-1 text-paragraph-xs font-medium text-success-base'>
                  <RiCheckLine className='size-3.5' aria-hidden='true' />
                  Access requested
                </span>
              ) : (
                <button
                  type='button'
                  onClick={onRequestAccess}
                  className='w-fit text-paragraph-xs font-medium text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline'
                >
                  Request access
                </button>
              )}
            </div>
          ) : (
            <GroupLabel>Organization</GroupLabel>
          )}
        </div>

        {ORG_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <TabMenuVertical.Trigger
              key={section.id}
              value={section.id}
              disabled={orgLocked}
              className={cn(
                orgLocked && 'cursor-not-allowed opacity-40',
              )}
            >
              <TabMenuVertical.Icon as={Icon} />
              <span>{section.label}</span>
            </TabMenuVertical.Trigger>
          );
        })}
      </TabMenuVertical.List>
    </TabMenuVertical.Root>
  );
}
