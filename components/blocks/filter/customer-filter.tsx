'use client';

import * as React from 'react';
import { RiUser6Line } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import {
  FilterPanelFooter,
  FilterPanelHeader,
  FilterPanelShell,
  FilterSearchField,
} from './filter-panel-shell';

const CUSTOMERS = [
  { name: 'James Brown' },
  { name: 'Sophia Williams' },
  { name: 'Arthur Taylor' },
  { name: 'Emma Wright' },
  { name: 'Matthew Johnson' },
  { name: 'Laura Perez' },
  { name: 'Wei Chen' },
];

function CustomerItem({
  name,
  selected,
  onSelect,
}: {
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const id = React.useId();

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Checkbox.Root
          id={id}
          checked={selected}
          onCheckedChange={onSelect}
        />
        <Label.Root htmlFor={id} className='text-paragraph-sm text-text-strong-950'>
          {name}
        </Label.Root>
      </div>
      <div className='text-paragraph-xs text-text-soft-400'>(Recipient)</div>
    </div>
  );
}

export function CustomerFilter() {
  const [activeFilter, setActiveFilter] = React.useState('Customers');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([
    'James Brown',
  ]);

  const toggleCustomer = (name: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    );
  };

  const selectAll = () => {
    setSelectedCustomers(CUSTOMERS.map((customer) => customer.name));
  };

  const clearSelection = () => {
    setSelectedCustomers([]);
  };

  const filteredCustomers = CUSTOMERS.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <FilterPanelShell
      activeFilter={activeFilter}
      onActiveFilterChange={setActiveFilter}
    >
      <FilterPanelHeader
        icon={RiUser6Line}
        title='Customers'
        bordered
        action={
          <LinkButton.Root variant='gray' onClick={selectAll}>
            Select All
          </LinkButton.Root>
        }
      />
      <FilterSearchField value={searchQuery} onChange={setSearchQuery} />
      <div className='flex max-h-[320px] flex-col gap-4 overflow-y-auto p-5'>
        {filteredCustomers.map((customer) => (
          <CustomerItem
            key={customer.name}
            name={customer.name}
            selected={selectedCustomers.includes(customer.name)}
            onSelect={() => toggleCustomer(customer.name)}
          />
        ))}
        {filteredCustomers.length === 0 && (
          <div className='py-4 text-center text-paragraph-sm text-text-sub-600'>
            No results found
          </div>
        )}
      </div>
      <FilterPanelFooter onClear={clearSelection} />
    </FilterPanelShell>
  );
}
