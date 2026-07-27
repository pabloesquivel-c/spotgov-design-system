'use client';

// Two-group vertical settings nav (Personal / Organization), built on
// TabMenuVertical. Controlled by a single `activeSection` value at the page
// level. The uppercase group labels are plain <div>s interspersed between the
// Radix triggers (Tabs.List tolerates non-trigger children).

import {
  RiBankCardLine,
  RiBriefcaseLine,
  RiEqualizer2Line,
  RiFileTextLine,
  RiNotification3Line,
  RiPlugLine,
  RiSettings3Line,
  RiShieldLine,
  RiTeamLine,
  RiUserLine,
  type RemixiconComponentType,
} from '@remixicon/react';

import * as TabMenuVertical from '@/components/ui/tab-menu-vertical';
export type SectionId =
  | 'profile'
  | 'preferences'
  | 'notifications'
  | 'security'
  | 'general'
  | 'members'
  | 'business-profile'
  | 'integrations'
  | 'analysis-templates'
  | 'billing';

type SectionDef = {
  id: SectionId;
  label: string;
  icon: RemixiconComponentType;
};

export const PERSONAL_SECTIONS: SectionDef[] = [
  { id: 'profile', label: 'Profile', icon: RiUserLine },
  { id: 'preferences', label: 'Preferences', icon: RiEqualizer2Line },
  { id: 'notifications', label: 'Notifications', icon: RiNotification3Line },
  { id: 'security', label: 'Security', icon: RiShieldLine },
];

export const ORG_SECTIONS: SectionDef[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'business-profile', label: 'Business Profile', icon: RiBriefcaseLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  {
    id: 'analysis-templates',
    label: 'Analysis Templates',
    icon: RiFileTextLine,
  },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
];

export type SettingsRailProps = {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
};

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-2 pb-1 pt-1 text-label-xs uppercase text-text-sub-600'>
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

        <div className='pt-4'>
          <GroupLabel>Organization</GroupLabel>
        </div>

        {ORG_SECTIONS.map((section) => (
          <SectionTrigger key={section.id} section={section} />
        ))}
      </TabMenuVertical.List>
    </TabMenuVertical.Root>
  );
}
