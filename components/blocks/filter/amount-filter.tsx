'use client';

import * as React from 'react';
import { RiMoneyDollarCircleLine } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import {
  FilterPanelFooter,
  FilterPanelHeader,
  FilterPanelShell,
} from './filter-panel-shell';

const DIRECTION_OPTIONS = [
  { id: 'amount-direction-any', label: 'Any', value: 'any' },
  {
    id: 'amount-direction-in',
    label: 'In (e.g. deposits, refunds)',
    value: 'in',
  },
  {
    id: 'amount-direction-out',
    label: 'Out (e.g. purchases, charges)',
    value: 'out',
  },
];

const AMOUNT_FIELDS = [
  { id: 'specific-amount', label: 'Specific Amount' },
  { id: 'min-amount', label: 'At least...' },
  { id: 'max-amount', label: 'No more than...' },
] as const;

export function AmountFilter() {
  const [activeFilter, setActiveFilter] = React.useState('Amount');
  const [directions, setDirections] = React.useState<string[]>(['any']);
  const [specificAmount, setSpecificAmount] = React.useState('');
  const [minAmount, setMinAmount] = React.useState('');
  const [maxAmount, setMaxAmount] = React.useState('');

  const amountValues = {
    'specific-amount': specificAmount,
    'min-amount': minAmount,
    'max-amount': maxAmount,
  };

  const amountSetters = {
    'specific-amount': setSpecificAmount,
    'min-amount': setMinAmount,
    'max-amount': setMaxAmount,
  };

  const toggleDirection = (value: string) => {
    setDirections((prev) =>
      prev.includes(value)
        ? prev.filter((direction) => direction !== value)
        : [...prev, value],
    );
  };

  const clearSelection = () => {
    setSpecificAmount('');
    setMinAmount('');
    setMaxAmount('');
    setDirections(['any']);
  };

  return (
    <FilterPanelShell
      activeFilter={activeFilter}
      onActiveFilterChange={setActiveFilter}
    >
      <FilterPanelHeader icon={RiMoneyDollarCircleLine} title='Amount' />
      <Divider.Root variant='solid-text'>DIRECTION</Divider.Root>
      <div className='flex flex-col gap-4 p-5'>
        {DIRECTION_OPTIONS.map((direction) => (
          <div key={direction.id} className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Checkbox.Root
                id={direction.id}
                checked={directions.includes(direction.value)}
                onCheckedChange={() => toggleDirection(direction.value)}
              />
              <Label.Root htmlFor={direction.id} className='text-paragraph-sm'>
                {direction.label}
              </Label.Root>
            </div>
            <span className='text-paragraph-xs text-text-soft-400'>
              (Recipient)
            </span>
          </div>
        ))}
      </div>
      <div className='flex flex-col gap-3 border-t border-stroke-soft-200 p-5'>
        {AMOUNT_FIELDS.map((field) => (
          <div key={field.id} className='flex flex-col gap-1'>
            <Label.Root htmlFor={field.id}>{field.label}</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <span className='text-paragraph-sm text-text-soft-400'>$</span>
                <Input.Input
                  id={field.id}
                  type='text'
                  placeholder='0.00'
                  value={amountValues[field.id]}
                  onChange={(event) =>
                    amountSetters[field.id](event.target.value)
                  }
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
        ))}
      </div>
      <FilterPanelFooter onClear={clearSelection} />
    </FilterPanelShell>
  );
}
