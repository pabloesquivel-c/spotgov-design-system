import { subDays, subMonths } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export type DateRangePreset = {
  label: string;
  dateRange: DateRange;
};

export const STANDARD_RANGE_PRESETS: DateRangePreset[] = [
  { label: 'Today', dateRange: { from: new Date(), to: new Date() } },
  {
    label: 'Last 7 days',
    dateRange: { from: subDays(new Date(), 7), to: new Date() },
  },
  {
    label: 'Last 30 days',
    dateRange: { from: subDays(new Date(), 30), to: new Date() },
  },
  {
    label: 'Last 3 months',
    dateRange: { from: subMonths(new Date(), 3), to: new Date() },
  },
  {
    label: 'Last 12 months',
    dateRange: { from: subMonths(new Date(), 12), to: new Date() },
  },
  {
    label: 'Month to date',
    dateRange: {
      from: new Date(new Date().setDate(1)),
      to: new Date(),
    },
  },
  {
    label: 'Year to date',
    dateRange: {
      from: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
      to: new Date(),
    },
  },
];

export const EXTENDED_RANGE_PRESETS: DateRangePreset[] = [
  ...STANDARD_RANGE_PRESETS,
  {
    label: 'All time',
    dateRange: { from: new Date(2020, 0, 1), to: new Date() },
  },
];
