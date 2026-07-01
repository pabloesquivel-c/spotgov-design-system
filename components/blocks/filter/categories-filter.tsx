'use client';

import * as React from 'react';
import { RiPriceTagLine } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Radio from '@/components/ui/radio';
import {
  FilterPanelFooter,
  FilterPanelHeader,
  FilterPanelShell,
  FilterSearchField,
} from './filter-panel-shell';

const CATEGORIES = [
  { id: 'advertising', label: 'Advertising' },
  { id: 'airlines', label: 'Airlines' },
  { id: 'alcohol', label: 'Alcohol and Bard' },
];

const TRANSACTION_TYPE_OPTIONS = [
  { value: 'all', id: 'all-transactions', label: 'All Transactions' },
  { value: 'categorized', id: 'categorized', label: 'Categorized' },
  { value: 'uncategorized', id: 'uncategorized', label: 'Uncategorized' },
];

export function CategoriesFilter() {
  const [activeFilter, setActiveFilter] = React.useState('Categories');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );
  const [filterType, setFilterType] = React.useState('all');

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearSelection = () => {
    setSelectedCategories([]);
  };

  const filteredCategories = CATEGORIES.filter((category) =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <FilterPanelShell
      activeFilter={activeFilter}
      onActiveFilterChange={setActiveFilter}
    >
      <FilterPanelHeader
        icon={RiPriceTagLine}
        title='Categories'
        bordered
      />
      <FilterSearchField
        value={searchQuery}
        onChange={setSearchQuery}
        className='gap-2'
      />
      <div className='p-5'>
        <Radio.Group
          className='flex flex-col gap-4'
          value={filterType}
          onValueChange={setFilterType}
        >
          {TRANSACTION_TYPE_OPTIONS.map((option) => (
            <div key={option.value} className='flex items-center gap-2'>
              <Radio.Item value={option.value} id={option.id} />
              <Label.Root htmlFor={option.id} className='text-paragraph-sm'>
                {option.label}
              </Label.Root>
            </div>
          ))}
        </Radio.Group>
      </div>
      <Divider.Root variant='solid-text'>CATEGORIES</Divider.Root>
      <div className='flex flex-col gap-4 p-5'>
        {filteredCategories.map((category) => {
          const checkboxId = `category-${category.id}`;

          return (
            <div key={category.id} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Checkbox.Root
                  id={checkboxId}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label.Root
                  htmlFor={checkboxId}
                  className='text-paragraph-sm text-text-strong-950'
                >
                  {category.label}
                </Label.Root>
              </div>
            </div>
          );
        })}
        {filteredCategories.length === 0 && (
          <div className='py-4 text-center text-paragraph-sm text-text-sub-600'>
            No results found
          </div>
        )}
      </div>
      <FilterPanelFooter onClear={clearSelection} />
    </FilterPanelShell>
  );
}
