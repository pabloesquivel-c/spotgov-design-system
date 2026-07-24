import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RiExpandUpDownLine } from '@remixicon/react';

import type { Organization } from './organization-switcher';
import { OrganizationSwitcher } from './organization-switcher';

const organizations: Organization[] = [
  { id: 'acme', name: 'Acme Corp', initials: 'AC' },
  { id: 'globex', name: 'Globex Industries', initials: 'GI' },
  { id: 'initech', name: 'Initech', initials: 'IN' },
  { id: 'umbrella', name: 'Umbrella Co', initials: 'UC' },
  { id: 'stark', name: 'Stark Ltd', initials: 'SL' },
  { id: 'wayne', name: 'Wayne Ent', initials: 'WE' },
];

const meta = {
  title: 'Blocks/OrganizationSwitcher',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mock organizations live in this story. The component receives organization data, the current organization ID, and a navigation callback from the application session.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OrganizationSwitcherDemo({
  initialOrganizationId = 'acme',
}: {
  initialOrganizationId?: string;
}) {
  const [activeOrganizationId, setActiveOrganizationId] = React.useState(
    initialOrganizationId,
  );
  const activeOrganization =
    organizations.find(
      (organization) => organization.id === activeOrganizationId,
    ) ?? organizations[0];

  return (
    <OrganizationSwitcher
      organizations={organizations}
      activeOrganizationId={activeOrganizationId}
      onOrganizationChange={setActiveOrganizationId}
      defaultOpen
    >
      <button
        type='button'
        className='flex min-w-[236px] items-center gap-2 rounded-10 bg-bg-white-0 p-2 text-left text-label-sm text-text-strong-950 shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-primary-base'
      >
        <span className='flex size-5 items-center justify-center rounded-full bg-primary-base text-label-xs text-static-white'>
          {activeOrganization.initials}
        </span>
        <span className='min-w-0 flex-1 truncate'>
          {activeOrganization.name}
        </span>
        <RiExpandUpDownLine className='size-5 shrink-0 text-text-sub-600' />
      </button>
    </OrganizationSwitcher>
  );
}

export const Default: Story = {
  render: () => <OrganizationSwitcherDemo />,
};

export const DifferentCurrentOrganization: Story = {
  render: () => <OrganizationSwitcherDemo initialOrganizationId='globex' />,
};
