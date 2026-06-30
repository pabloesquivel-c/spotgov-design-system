import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';
import * as Drawer from './drawer';

const meta = { title: 'UI/Drawer', component: Drawer.Root } satisfies Meta<typeof Drawer.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button.Root variant='primary' mode='filled'>Open drawer</Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header><Drawer.Title>Drawer title</Drawer.Title></Drawer.Header>
      </Drawer.Content>
    </Drawer.Root>
  ),
};
