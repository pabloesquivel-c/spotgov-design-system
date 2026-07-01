'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import * as Select from '@/components/ui/select';
import { drawerPanelClassName } from './drawer-panel';

const CONTENT_ITEMS = [
  { id: 'content-archived', label: 'Archived' },
  { id: 'content-official', label: 'Official Content' },
  { id: 'content-template', label: 'Template', checked: true },
];

const TIME_OPTIONS = [
  { value: 'any-time', label: 'Any Time' },
  { value: 'last-hour', label: 'Last Hour' },
  { value: 'last-24h', label: 'Last 24 Hours' },
  { value: 'last-7d', label: 'Last 7 Days' },
  { value: 'last-30d', label: 'Last 30 Days' },
  { value: 'last-year', label: 'Last Year' },
];

export function ContentFiltersDrawer() {
  const [open, setOpen] = React.useState(false);
  const [lastEdited, setLastEdited] = React.useState('any-time');
  const [space, setSpace] = React.useState('');
  const [editor, setEditor] = React.useState('');
  const [project, setProject] = React.useState('');

  const filterFields = [
    {
      label: 'Space',
      value: space,
      setter: setSpace,
      placeholder: 'Filter by space...',
      id: 'content-filter-space',
    },
    {
      label: 'Editor',
      value: editor,
      setter: setEditor,
      placeholder: 'Filter by editor...',
      id: 'content-filter-editor',
    },
    {
      label: 'Project',
      value: project,
      setter: setProject,
      placeholder: 'Filter by project...',
      id: 'content-filter-project',
    },
  ];

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Filters by
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content className={drawerPanelClassName}>
        <div className='flex h-full flex-col'>
          <Drawer.Header showCloseButton={false}>
            <Drawer.Title className='text-label-lg text-text-strong-950'>
              Filters by
            </Drawer.Title>
            <Drawer.Close asChild>
              <LinkButton.Root size='medium'>Clear All Filters</LinkButton.Root>
            </Drawer.Close>
          </Drawer.Header>
          <Drawer.Body className='flex-1 overflow-y-auto'>
            <Divider.Root variant='solid-text'>CONTENT</Divider.Root>
            <div className='space-y-4 p-5'>
              {CONTENT_ITEMS.map((item) => (
                <div key={item.id} className='flex items-center gap-2'>
                  <Checkbox.Root id={item.id} defaultChecked={item.checked} />
                  <Label.Root
                    htmlFor={item.id}
                    className='text-paragraph-sm text-text-strong-950'
                  >
                    {item.label}
                  </Label.Root>
                </div>
              ))}
            </div>
            <Divider.Root variant='solid-text'>SORT BY</Divider.Root>
            <div className='space-y-3 p-5'>
              <div className='space-y-1'>
                <Label.Root
                  htmlFor='content-filter-last-edited'
                  className='text-label-sm text-text-strong-950'
                >
                  Last edited
                </Label.Root>
                <Select.Root value={lastEdited} onValueChange={setLastEdited}>
                  <Select.Trigger
                    className='w-full'
                    id='content-filter-last-edited'
                  >
                    <Select.Value>
                      {
                        TIME_OPTIONS.find((option) => option.value === lastEdited)
                          ?.label
                      }
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Content>
                    {TIME_OPTIONS.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              {filterFields.map((field) => (
                <div key={field.id} className='space-y-1'>
                  <Label.Root
                    htmlFor={field.id}
                    className='text-label-sm text-text-strong-950'
                  >
                    {field.label}
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        id={field.id}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              ))}
            </div>
          </Drawer.Body>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
