import type { Meta, StoryObj } from '@storybook/react';
import {
  DualRangeDatepicker,
  EventCalendarDatepicker,
  InlineRangeDatepicker,
  PopoverRangeDatepicker,
  SchedulingDatepicker,
} from './index';

const meta = {
  title: 'Blocks/Datepicker',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InlineRange: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <InlineRangeDatepicker />,
};

export const PopoverRange: Story = {
  render: () => <PopoverRangeDatepicker />,
};

export const Scheduling: Story = {
  render: () => <SchedulingDatepicker />,
};

export const EventCalendar: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <EventCalendarDatepicker />,
};

export const DualRange: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <DualRangeDatepicker />,
};
