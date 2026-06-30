import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import * as Component from './file-upload';

const Root = 'Root' in Component ? Component.Root : Object.values(Component).find((v) => typeof v === 'function');

const meta = {
  title: 'UI/FileUpload',
  component: Root,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    if (!Root) return <div>No renderable export</div>;
    const C = Root as React.ComponentType<{ children?: React.ReactNode }>;
    return <C>Example</C>;
  },
};
