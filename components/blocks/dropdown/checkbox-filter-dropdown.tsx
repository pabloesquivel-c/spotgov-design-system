'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';

type GroupItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

type FilterGroup = {
  id: string;
  label: string;
  items: GroupItem[];
};

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'social',
    label: 'Social Media',
    items: [
      { id: 'google', label: 'Google' },
      { id: 'youtube', label: 'Youtube' },
      { id: 'instagram', label: 'Instagram' },
      { id: 'linkedin', label: 'Linkedin', disabled: true },
    ],
  },
  {
    id: 'companies',
    label: 'Companies',
    items: [
      { id: 'apex', label: 'Apex Tech' },
      { id: 'synergy', label: 'Synergy HR' },
    ],
  },
];

function getGroupState(
  groupItems: GroupItem[],
  checkedItems: Set<string>,
) {
  const checkedCount = groupItems.filter((item) =>
    checkedItems.has(item.id),
  ).length;

  return {
    checked: checkedCount === groupItems.length,
    indeterminate: checkedCount > 0 && checkedCount < groupItems.length,
  };
}

export function CheckboxFilterDropdown() {
  const [checkedItems, setCheckedItems] = React.useState(
    new Set(['linkedin']),
  );

  const handleGroupCheck = (
    groupItems: GroupItem[],
    checked: boolean | string,
  ) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);

      groupItems.forEach((item) => {
        if (!item.disabled) {
          if (checked) {
            next.add(item.id);
          } else {
            next.delete(item.id);
          }
        }
      });

      return next;
    });
  };

  const handleItemCheck = (id: string, checked: boolean | string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const renderGroup = (group: FilterGroup) => {
    const { checked, indeterminate } = getGroupState(
      group.items,
      checkedItems,
    );

    return (
      <Dropdown.Group key={group.id}>
        <Dropdown.Item
          onSelect={(event) => {
            event.preventDefault();
            handleGroupCheck(group.items, !checked);
          }}
        >
          <Checkbox.Root
            checked={indeterminate ? 'indeterminate' : checked}
            onCheckedChange={(value) => handleGroupCheck(group.items, value)}
          />
          {group.label}
        </Dropdown.Item>
        {group.items.map((item) => (
          <Dropdown.Item
            key={item.id}
            className='pl-9'
            disabled={item.disabled}
            onSelect={(event) => {
              event.preventDefault();
              if (!item.disabled) {
                handleItemCheck(item.id, !checkedItems.has(item.id));
              }
            }}
          >
            <Checkbox.Root
              checked={checkedItems.has(item.id)}
              disabled={item.disabled}
              onCheckedChange={(value) => handleItemCheck(item.id, value)}
            />
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Group>
    );
  };

  return (
    <Dropdown.Root defaultOpen>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Open
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        {FILTER_GROUPS.map((group, index) => (
          <React.Fragment key={group.id}>
            {index > 0 && <Divider.Root variant='line-spacing' />}
            {renderGroup(group)}
          </React.Fragment>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
