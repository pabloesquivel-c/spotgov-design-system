'use client';

// Vertical settings nav for the Settings modal, matching the "Settings
// Sidebar" Figma frame (node 211:3134) pixel-for-pixel. Built directly on
// Radix Tabs rather than the shared TabMenuVertical primitive because this
// frame's spacing (12/8 item padding, 4px inter-item gap, 20px inter-group
// gap) and active-state color (black icon+label, no accent bar) diverge from
// that primitive's defaults.

import * as TabsPrimitive from '@radix-ui/react-tabs';
import {
  RiBriefcase3Line,
  RiGitBranchLine,
  RiGroupLine,
  RiMoneyPoundCircleLine,
  RiNotificationLine,
  RiPagesLine,
  RiPaletteLine,
  RiSettings5Line,
  RiUser3Line,
  type RemixiconComponentType,
} from '@remixicon/react';

import { cn } from '@/utils/cn';

export type SettingsModalSectionId =
  | 'profile'
  | 'preferences'
  | 'notifications'
  | 'general'
  | 'members'
  | 'business-profile'
  | 'integrations'
  | 'analysis-templates'
  | 'billing';

type SectionDef = {
  id: SettingsModalSectionId;
  label: string;
  icon: RemixiconComponentType;
};

// Rail label, page title, and SECTION_COPY.title use one vocabulary, with no
// redundant "Settings" suffix. The `profile`/`general`/`members` ids stay as
// they are internally (to avoid a rename ripple through the rest of the
// modal) — only their displayed labels changed, to Account / Company / Team.
export const PERSONAL_SECTIONS: SectionDef[] = [
  { id: 'profile', label: 'Account', icon: RiUser3Line },
  { id: 'preferences', label: 'Preferences', icon: RiPaletteLine },
  { id: 'notifications', label: 'Notifications', icon: RiNotificationLine },
];

export const ORG_SECTIONS: SectionDef[] = [
  { id: 'general', label: 'Company', icon: RiSettings5Line },
  { id: 'members', label: 'Team', icon: RiGroupLine },
  {
    id: 'business-profile',
    label: 'Business profile',
    icon: RiBriefcase3Line,
  },
  { id: 'integrations', label: 'Integrations', icon: RiGitBranchLine },
  { id: 'analysis-templates', label: 'Analysis templates', icon: RiPagesLine },
  { id: 'billing', label: 'Billing', icon: RiMoneyPoundCircleLine },
];

// "Personal" / "Organization" — Figma's shorter form, not "Personal Settings"
// / "Organization Settings" (B12). Sentence case per Figma, not uppercase.
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center px-3 py-1 text-label-xs text-text-sub-600'>
      {children}
    </div>
  );
}

function SectionTrigger({ section }: { section: SectionDef }) {
  const Icon = section.icon;
  return (
    <TabsPrimitive.Trigger
      value={section.id}
      className={cn(
        'group/tab-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-label-sm text-text-sub-600 outline-none',
        'transition duration-200 ease-out hover:bg-bg-weak-50',
        'focus-visible:bg-bg-white-0 focus-visible:text-text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-stroke-strong-950',
        'active:bg-bg-soft-200',
        'data-[state=active]:bg-bg-weak-50 data-[state=active]:text-text-strong-950',
      )}
    >
      <Icon
        className={cn(
          'size-5 shrink-0 text-text-sub-600 transition duration-200 ease-out',
          'group-data-[state=active]/tab-item:text-text-strong-950',
        )}
      />
      <span>{section.label}</span>
    </TabsPrimitive.Trigger>
  );
}

export type SettingsModalRailProps = {
  activeSection: SettingsModalSectionId;
  onSectionChange: (id: SettingsModalSectionId) => void;
  isAdmin?: boolean;
};

export function SettingsModalRail({
  activeSection,
  onSectionChange,
  isAdmin = false,
}: SettingsModalRailProps) {
  return (
    <TabsPrimitive.Root
      orientation='vertical'
      value={activeSection}
      onValueChange={(v) => onSectionChange(v as SettingsModalSectionId)}
      className='flex h-full min-h-0 w-64 shrink-0 flex-col overflow-y-auto border-r border-stroke-soft-200 bg-bg-white-0 px-2.5 py-4'
    >
      <TabsPrimitive.List className='flex w-full flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <GroupLabel>Personal</GroupLabel>
          <div className='flex flex-col gap-1'>
            {PERSONAL_SECTIONS.map((section) => (
              <SectionTrigger key={section.id} section={section} />
            ))}
          </div>
        </div>

        {isAdmin ? (
          <div className='flex flex-col gap-2'>
            <GroupLabel>Organization</GroupLabel>
            <div className='flex flex-col gap-1'>
              {ORG_SECTIONS.map((section) => (
                <SectionTrigger key={section.id} section={section} />
              ))}
            </div>
          </div>
        ) : null}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
