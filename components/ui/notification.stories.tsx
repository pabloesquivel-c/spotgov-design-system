import type { Meta, StoryObj } from '@storybook/react';
import * as Notification from './notification';

const meta = { title: 'UI/Notification', component: Notification.Root } satisfies Meta<typeof Notification.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Notification.Provider>
      <Notification.Root open status='information' title='Saved' description='Changes saved successfully.' />
      <Notification.Viewport />
    </Notification.Provider>
  ),
};
