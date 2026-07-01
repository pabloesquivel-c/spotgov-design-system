'use client';

import * as React from 'react';
import * as LabelPrimitives from '@radix-ui/react-label';
import { RiSearch2Line } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';

const sections = [
  {
    title: 'Talent Management',
    items: [
      {
        id: 'talent-acquisition',
        label: 'Talent Acquisition',
        description: 'Recruiting and hiring processes',
        defaultChecked: true,
      },
      {
        id: 'talent-analytics',
        label: 'Talent Analytics',
        description: 'Data-driven workforce insights',
        defaultChecked: true,
      },
      {
        id: 'succession-planning',
        label: 'Succession Planning',
        description: 'Leadership pipeline development',
        defaultChecked: false,
      },
    ],
  },
  {
    title: 'Organization',
    items: [
      {
        id: 'change-management',
        label: 'Change Management',
        description: 'Organizational transformation',
        defaultChecked: true,
      },
      {
        id: 'hr-operations',
        label: 'HR Operations',
        description: 'Policy and compliance management',
        defaultChecked: false,
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        id: 'compensation',
        label: 'Compensation & Benefits',
        description: 'Salary structures and benefit programs',
        defaultChecked: false,
      },
      {
        id: 'engagement',
        label: 'Employee Engagement',
        description: 'Workplace culture and satisfaction programs',
        defaultChecked: false,
      },
    ],
  },
];

export function HrDashboardCheckbox() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className='flex w-[400px] flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-label-md text-text-strong-950'>
            Customize Your HR Dashboard
          </h2>
          <p className='text-paragraph-sm text-text-sub-600 sm:whitespace-nowrap'>
            Select your HR expertise areas to customize your workspace.
          </p>
        </div>

        <Input.Root size='small' className='w-full'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input
              type='text'
              placeholder='Search expertise areas...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Input.Wrapper>
        </Input.Root>
      </div>

      <div className='flex flex-col gap-6 overflow-y-auto'>
        {filteredSections.map((section) => (
          <div key={section.title} className='flex flex-col gap-4'>
            <div className='text-label-sm text-text-soft-400'>{section.title}</div>

            <div className='flex flex-col gap-4'>
              {section.items.map((item) => (
                <div key={item.id} className='flex items-start gap-2'>
                  <Checkbox.Root
                    id={item.id}
                    defaultChecked={item.defaultChecked}
                  />
                  <LabelPrimitives.Root
                    className='flex cursor-pointer flex-col gap-1'
                    htmlFor={item.id}
                  >
                    <div className='text-label-sm text-text-strong-950'>
                      {item.label}
                    </div>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      {item.description}
                    </div>
                  </LabelPrimitives.Root>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
