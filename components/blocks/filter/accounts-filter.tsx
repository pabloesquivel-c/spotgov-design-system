'use client';

import * as React from 'react';
import { RiBankLine } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import {
  FilterPanelFooter,
  FilterPanelHeader,
  FilterPanelShell,
  FilterSearchField,
} from './filter-panel-shell';

const ACCOUNTS = [
  { name: 'Credit' },
  { name: 'Treasury' },
  { name: 'Ops / Payroll' },
  { name: 'AP' },
  { name: 'AR' },
  { name: 'Checking' },
  { name: 'Savings' },
];

function AccountItem({
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
    <div className='flex items-center'>
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
    </div>
  );
}

export function AccountsFilter() {
  const [activeFilter, setActiveFilter] = React.useState('Accounts');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([
    'Ops / Payroll',
    'Checking',
  ]);

  const toggleAccount = (name: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    );
  };

  const selectAll = () => {
    setSelectedAccounts(ACCOUNTS.map((account) => account.name));
  };

  const clearSelection = () => {
    setSelectedAccounts([]);
  };

  const filteredAccounts = ACCOUNTS.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <FilterPanelShell
      activeFilter={activeFilter}
      onActiveFilterChange={setActiveFilter}
    >
      <FilterPanelHeader
        icon={RiBankLine}
        title='Accounts'
        bordered
        action={
          <LinkButton.Root variant='gray' onClick={selectAll}>
            Select All
          </LinkButton.Root>
        }
      />
      <FilterSearchField
        value={searchQuery}
        onChange={setSearchQuery}
        className='gap-2'
      />
      <div className='flex max-h-[320px] flex-col gap-4 overflow-y-auto p-5'>
        {filteredAccounts.map((account) => (
          <AccountItem
            key={account.name}
            name={account.name}
            selected={selectedAccounts.includes(account.name)}
            onSelect={() => toggleAccount(account.name)}
          />
        ))}
        {filteredAccounts.length === 0 && (
          <div className='py-4 text-center text-paragraph-sm text-text-sub-600'>
            No results found
          </div>
        )}
      </div>
      <FilterPanelFooter onClear={clearSelection} />
    </FilterPanelShell>
  );
}
