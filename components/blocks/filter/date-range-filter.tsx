'use client';

import * as React from 'react';
import { RiCalendarLine } from '@remixicon/react';

import {
  FilterPanelFooter,
  FilterPanelHeader,
  FilterPanelShell,
} from './filter-panel-shell';
import { HorizontalDivider } from './filter-sidebar';
import { MonthRangePicker, useMonthDateRange } from './month-range-picker';

export function DateRangeFilter() {
  const [activeFilter, setActiveFilter] = React.useState('Date');
  const monthRange = useMonthDateRange();

  return (
    <FilterPanelShell
      activeFilter={activeFilter}
      onActiveFilterChange={setActiveFilter}
    >
      <FilterPanelHeader icon={RiCalendarLine} title='Date' />
      <HorizontalDivider />
      <MonthRangePicker {...monthRange} />
      <FilterPanelFooter onClear={monthRange.handleClear} />
    </FilterPanelShell>
  );
}
