import type { Meta, StoryObj } from '@storybook/react';
import * as TabMenuVertical from './tab-menu-vertical';

const meta = { title: 'UI/TabMenuVertical', component: TabMenuVertical.Root } satisfies Meta<typeof TabMenuVertical.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TabMenuVertical.Root defaultValue='overview'>
      <TabMenuVertical.List>
        <TabMenuVertical.Trigger value='overview'>Overview</TabMenuVertical.Trigger>
        <TabMenuVertical.Trigger value='settings'>Settings</TabMenuVertical.Trigger>
      </TabMenuVertical.List>
    </TabMenuVertical.Root>
  ),
};
