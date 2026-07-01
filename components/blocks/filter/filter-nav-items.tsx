import {
  RiBankLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiPriceTag3Line,
  RiUser6Line,
} from '@remixicon/react';

export const FILTER_NAV_ITEMS = [
  { icon: <RiCalendarLine />, label: 'Date' },
  { icon: <RiUser6Line />, label: 'Customers' },
  { icon: <RiMoneyDollarCircleLine />, label: 'Amount' },
  { icon: <RiPriceTag3Line />, label: 'Categories' },
  { icon: <RiBankLine />, label: 'Accounts' },
] as const;

export type FilterNavLabel = (typeof FILTER_NAV_ITEMS)[number]['label'];
