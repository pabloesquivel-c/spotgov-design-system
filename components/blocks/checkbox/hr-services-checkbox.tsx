'use client';

import * as React from 'react';
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckboxCircleLine,
  RiDeleteBinLine,
  RiEditLine,
  RiErrorWarningLine,
  RiLoader2Line,
  RiMore2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import * as Dropdown from '@/components/ui/dropdown';

type StatusType = 'success' | 'warning' | 'error' | 'default';

const sections = [
  {
    id: 'talent-management',
    title: 'Talent Management',
    description: 'Complete talent acquisition and management system.',
    items: [
      {
        id: 'recruitment-process',
        label: 'Recruitment Process',
        status: 'success' as StatusType,
      },
      {
        id: 'performance-management',
        label: 'Performance Management',
        status: 'warning' as StatusType,
      },
      {
        id: 'succession-planning',
        label: 'Succession Planning',
        status: 'default' as StatusType,
      },
    ],
  },
  {
    id: 'employee-experience',
    title: 'Employee Experience',
    description: 'Enhance employee engagement and satisfaction.',
    items: [
      {
        id: 'feedback-systems',
        label: 'Feedback Systems',
        status: 'success' as StatusType,
      },
      {
        id: 'employee-development',
        label: 'Employee Development',
        status: 'error' as StatusType,
      },
      {
        id: 'engagement-metrics',
        label: 'Engagement Metrics',
        status: 'default' as StatusType,
      },
    ],
  },
  {
    id: 'hr-analytics',
    title: 'HR Analytics',
    description: 'Data-driven HR insights and reporting.',
    items: [
      {
        id: 'performance-analytics',
        label: 'Performance Analytics',
        status: 'error' as StatusType,
      },
      {
        id: 'workforce-planning',
        label: 'Workforce Planning',
        status: 'warning' as StatusType,
      },
      {
        id: 'retention-analysis',
        label: 'Retention Analysis',
        status: 'default' as StatusType,
      },
    ],
  },
];

function DottedDivider() {
  return (
    <div className='relative h-0 w-full text-stroke-soft-200' role='separator'>
      <div
        className='absolute left-0 h-px w-full'
        style={{
          background:
            'linear-gradient(90deg, currentColor 4px, transparent 4px) 50% 50% / 8px 1px repeat no-repeat',
        }}
      />
    </div>
  );
}

function StatusIcon({ status }: { status: StatusType }) {
  const iconConfig = {
    success: { icon: RiCheckboxCircleLine, className: 'text-success-base' },
    warning: { icon: RiAlertLine, className: 'text-warning-base' },
    error: { icon: RiErrorWarningLine, className: 'text-error-base' },
    default: { icon: RiLoader2Line, className: 'text-text-disabled-300' },
  };

  const config = iconConfig[status];
  const Icon = config.icon;

  return <Icon className={`size-4 shrink-0 ${config.className}`} />;
}

export function HrServicesCheckbox() {
  return (
    <div className='w-full max-w-[540px]'>
      <div className='flex items-end justify-between'>
        <div>
          <h2 className='text-label-md text-text-strong-950'>
            HR Management Solutions
          </h2>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Select services to enhance your HR operations
          </p>
        </div>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='flex w-[120px] items-center gap-0 rounded-10'
        >
          <span className='text-label-sm text-text-sub-600'>All services</span>
          <RiArrowDownSLine className='size-5 shrink-0 text-text-sub-600' />
        </Button.Root>
      </div>

      <div className='flex flex-col gap-2.5 pt-5'>
        {sections.map((section) => (
          <label key={section.id} className='block'>
            <div className='cursor-pointer rounded-20 bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 hover:shadow-none hover:ring-0'>
              <div className='flex items-start gap-3'>
                <Checkbox.Root id={section.id} />
                <div className='flex flex-1 flex-col gap-1'>
                  <div className='text-label-sm text-text-strong-950'>
                    {section.title}
                  </div>
                  <div className='text-paragraph-xs text-text-sub-600'>
                    {section.description}
                  </div>
                </div>
              </div>

              <div className='mt-3 pl-8'>
                <DottedDivider />
              </div>

              <div className='pl-8'>
                {section.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div
                      className={`flex items-start gap-2 ${
                        index === section.items.length - 1 ? 'pt-3' : 'py-3'
                      }`}
                      tabIndex={-1}
                    >
                      <StatusIcon status={item.status} />
                      <div className='flex-1 text-label-xs text-text-sub-600'>
                        {item.label}
                      </div>
                      <Dropdown.Root>
                        <Dropdown.Trigger asChild>
                          <CompactButton.Root
                            variant='ghost'
                            className='size-4 text-text-soft-400 focus:outline-none data-[state=open]:text-primary-base'
                            tabIndex={-1}
                          >
                            <CompactButton.Icon
                              as={RiMore2Line}
                              className='size-4'
                              tabIndex={-1}
                            />
                          </CompactButton.Root>
                        </Dropdown.Trigger>
                        <Dropdown.Portal>
                          <Dropdown.Content
                            align='start'
                            side='left'
                            className='w-[144px] rounded-10 shadow-regular-md ring-0'
                          >
                            <Dropdown.Group className='flex flex-col gap-0.5'>
                              <Dropdown.Item className='group flex w-full items-center justify-between gap-1.5 rounded-lg p-1.5 hover:bg-bg-weak-50'>
                                <div className='flex items-center gap-1.5'>
                                  <RiLoader2Line className='size-4 text-text-soft-400 group-hover:text-text-sub-600' />
                                  <span className='text-label-xs text-text-sub-600'>
                                    Details
                                  </span>
                                </div>
                                <RiArrowRightSLine className='size-4 text-text-soft-400 opacity-0 transition-opacity group-hover:opacity-100' />
                              </Dropdown.Item>
                              <Dropdown.Item className='group flex w-full items-center justify-between gap-1.5 rounded-lg p-1.5 hover:bg-bg-weak-50'>
                                <div className='flex items-center gap-1.5'>
                                  <RiEditLine className='size-4 text-text-soft-400 group-hover:text-text-sub-600' />
                                  <span className='text-label-xs text-text-sub-600'>
                                    Edit
                                  </span>
                                </div>
                                <RiArrowRightSLine className='size-4 text-text-soft-400 opacity-0 transition-opacity group-hover:opacity-100' />
                              </Dropdown.Item>
                              <Dropdown.Item className='group flex w-full items-center justify-between gap-1.5 rounded-lg p-1.5 hover:bg-bg-weak-50'>
                                <div className='flex items-center gap-1.5'>
                                  <RiDeleteBinLine className='size-4 text-text-soft-400 group-hover:text-text-sub-600' />
                                  <span className='text-label-xs text-text-sub-600'>
                                    Delete
                                  </span>
                                </div>
                                <RiArrowRightSLine className='size-4 text-text-soft-400 opacity-0 transition-opacity group-hover:opacity-100' />
                              </Dropdown.Item>
                            </Dropdown.Group>
                          </Dropdown.Content>
                        </Dropdown.Portal>
                      </Dropdown.Root>
                    </div>
                    {index < section.items.length - 1 && <DottedDivider />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
