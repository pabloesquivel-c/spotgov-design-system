import type { Meta, StoryObj } from '@storybook/react';
import * as CommandMenu from './command-menu';

const meta = { title: 'UI/CommandMenu', component: CommandMenu.Dialog } satisfies Meta<typeof CommandMenu.Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CommandMenu.Dialog open>
      <CommandMenu.Input placeholder='Search commands…' />
      <CommandMenu.List>
        <CommandMenu.Group heading='Actions'>
          <CommandMenu.Item>Find tenders</CommandMenu.Item>
          <CommandMenu.Item>Export report</CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>
    </CommandMenu.Dialog>
  ),
};
