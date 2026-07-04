'use client';

import * as React from 'react';
import { RiArrowDownSLine, RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';
import * as ProgressBar from '@/components/ui/progress-bar';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as StatusBadge from '@/components/ui/status-badge';

const modules = [
  {
    id: 'talent-management',
    title: 'Talent Management',
    description: 'Recruitment, onboarding, and employee lifecycle',
    type: 'Core HR',
    priority: 'Critical',
    progress: 0,
    defaultChecked: true,
    badge: { label: 'Critical', color: 'failed' as const },
  },
  {
    id: 'performance-reviews',
    title: 'Performance Reviews',
    description: 'Employee evaluations and feedback tracking',
    type: 'Review',
    priority: 'High',
    progress: 60,
    defaultChecked: false,
    badge: { label: 'High', color: 'pending' as const },
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Policy management and document control',
    type: 'Policy',
    priority: 'Low',
    progress: 0,
    defaultChecked: false,
    badge: { label: 'Medium', color: 'information' as const },
  },
  {
    id: 'benefits-admin',
    title: 'Benefits Admin',
    description: 'Compensation and benefits management',
    type: 'Admin',
    priority: 'Low',
    progress: 0,
    defaultChecked: false,
    badge: { label: 'Low', color: 'completed' as const },
  },
];

function IconInfoCustom(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={12}
      height={12}
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM7.07121 9.08024L7.16702 8.68857C7.11743 8.71186 7.03747 8.73848 6.92783 8.76877C6.81789 8.79907 6.71894 8.8145 6.63198 8.8145C6.44675 8.8145 6.31634 8.78414 6.24063 8.72311C6.16546 8.66208 6.12798 8.54728 6.12798 8.37914C6.12798 8.31252 6.13928 8.21321 6.16294 8.08323C6.18587 7.95238 6.21223 7.83611 6.24155 7.7344L6.59922 6.46808C6.63425 6.35187 6.65828 6.2241 6.67119 6.08466C6.6844 5.94552 6.69055 5.84817 6.69055 5.79292C6.69055 5.52589 6.59695 5.3092 6.40969 5.14204C6.22243 4.975 5.95577 4.89148 5.6102 4.89148C5.41791 4.89148 5.21461 4.92565 4.99945 4.99393C4.78429 5.06202 4.55936 5.14406 4.32404 5.23987L4.22798 5.63184C4.29811 5.60591 4.38163 5.57801 4.47934 5.54912C4.57663 5.52036 4.67207 5.50549 4.76493 5.50549C4.95452 5.50549 5.08223 5.53782 5.14916 5.60148C5.21608 5.66534 5.2497 5.77891 5.2497 5.94128C5.2497 6.03107 5.23907 6.13081 5.217 6.23922C5.19525 6.34831 5.16809 6.46366 5.13613 6.5854L4.77691 7.85682C4.74496 7.99043 4.7216 8.10996 4.70691 8.21609C4.69235 8.32211 4.68534 8.42615 4.68534 8.52731C4.68534 8.78862 4.78189 9.00403 4.97493 9.17402C5.16796 9.34333 5.43862 9.42857 5.78658 9.42857C6.01317 9.42857 6.21205 9.39895 6.3832 9.3394C6.55418 9.28003 6.78378 9.19368 7.07121 9.08024ZM7.00748 3.9362C7.17458 3.78126 7.25773 3.59284 7.25773 3.37221C7.25773 3.15207 7.1747 2.96328 7.00748 2.80638C6.84081 2.64991 6.63991 2.57143 6.40502 2.57143C6.1694 2.57143 5.9677 2.64972 5.79943 2.80638C5.63116 2.96328 5.54684 3.15201 5.54684 3.37221C5.54684 3.59284 5.63116 3.7812 5.79943 3.9362C5.968 4.09168 6.16934 4.16948 6.40502 4.16948C6.63997 4.16948 6.84081 4.09168 7.00748 3.9362Z'
        fill='currentColor'
      />
    </svg>
  );
}

export function HrModulesCheckbox() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredModules = modules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='w-full max-w-[480px]'>
      <div className='mb-4'>
        <h2 className='text-label-md text-text-strong-950'>Configure HR System</h2>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Select HR modules, critical ones required
        </p>
      </div>

      <div className='mb-4'>
        <SegmentedControl.Root defaultValue='core'>
          <SegmentedControl.List>
            <SegmentedControl.Trigger value='core'>
              Core features
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value='advanced'>
              Advanced features
            </SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>
      </div>

      <div className='mb-4 flex items-center justify-between gap-3'>
        <Input.Root size='small'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input
              type='text'
              placeholder='Search modules...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Input.Wrapper>
        </Input.Root>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='flex items-center gap-1 text-label-sm text-text-sub-600'
        >
          All priorities
          <RiArrowDownSLine className='size-4' />
        </Button.Root>
      </div>

      <div className='mb-4'>
        <div className='flex items-center justify-between'>
          <div className='text-label-sm text-text-strong-950'>
            Configuration progress
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>60%</div>
        </div>
        <ProgressBar.Root value={60} className='mt-1.5' />
        <div className='mt-1.5 text-paragraph-xs text-text-sub-600'>
          In-progress...
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {filteredModules.map((module) => (
          <label
            key={module.id}
            htmlFor={module.id}
            className='group block cursor-pointer rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-stroke-soft-200 transition-all duration-200 hover:bg-bg-weak-50 hover:shadow-none hover:ring-transparent'
          >
            <div className='flex items-start gap-3'>
              <Checkbox.Root
                id={module.id}
                defaultChecked={module.defaultChecked}
              />
              <div className='w-full'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        <div className='text-label-sm text-text-strong-950'>
                          {module.title}
                        </div>
                        <IconInfoCustom className='size-3 text-text-disabled-300' />
                      </div>
                    </div>
                    <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                      {module.description}
                    </div>
                    <div className='mt-3 inline-flex w-full flex-wrap gap-2 rounded-lg bg-bg-weak-50 px-3 py-1.5 text-paragraph-xs text-text-sub-600 transition-colors duration-200 group-hover:bg-bg-white-0 group-hover:shadow-regular-xs'>
                      <div className='flex items-center gap-1'>
                        <span className='text-paragraph-xs text-text-sub-600'>
                          Type:
                        </span>
                        <span className='text-label-xs text-text-strong-950'>
                          {module.type}
                        </span>
                      </div>
                      <span className='hidden text-text-disabled-300 sm:inline'>
                        ・
                      </span>
                      <div className='flex items-center gap-1'>
                        <span className='text-paragraph-xs text-text-sub-600'>
                          Priority:
                        </span>
                        <span className='text-label-xs text-text-strong-950'>
                          {module.priority}
                        </span>
                      </div>
                      <span className='hidden text-text-disabled-300 sm:inline'>
                        ・
                      </span>
                      <div className='flex items-center gap-1'>
                        <span className='text-paragraph-xs text-text-sub-600'>
                          Progress:
                        </span>
                        <span className='text-label-xs text-text-strong-950'>
                          {module.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge.Root
                    variant='light'
                    status={
                      module.badge.color === 'information'
                        ? 'disabled'
                        : module.badge.color
                    }
                    className={
                      module.badge.color === 'information'
                        ? 'bg-transparent text-label-xs text-information-base'
                        : 'bg-transparent text-label-xs'
                    }
                  >
                    <StatusBadge.Dot
                      className={
                        module.badge.color === 'information'
                          ? 'text-information-base'
                          : undefined
                      }
                    />
                    <span className='text-label-xs'>{module.badge.label}</span>
                  </StatusBadge.Root>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
