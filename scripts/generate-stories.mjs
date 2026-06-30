#!/usr/bin/env node
/**
 * Generates minimal Storybook stories for each file in components/ui/.
 * Re-run after adding new primitives: node scripts/generate-stories.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const UI_DIR = path.join(process.cwd(), 'components/ui');

const SKIP = new Set(['notification-provider.tsx']);

const OVERRIDES = {
  'accordion.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Accordion from './accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion.Root,
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion.Root type='single' collapsible className='w-full max-w-md'>
      <Accordion.Item value='item-1'>
        <Accordion.Trigger>Section one</Accordion.Trigger>
        <Accordion.Content>Accordion content goes here.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
`,
  'alert.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Alert from './alert';
import { RiInformationLine } from '@remixicon/react';

const meta = {
  title: 'UI/Alert',
  component: Alert.Root,
} satisfies Meta<typeof Alert.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert.Root variant='lighter' status='information' className='max-w-md'>
      <Alert.Icon as={RiInformationLine} />
      <div className='space-y-1'>
        <p className='text-label-sm text-text-strong-950'>Information</p>
        <p className='text-paragraph-sm text-text-sub-600'>SpotGov design system alert.</p>
      </div>
    </Alert.Root>
  ),
};
`,
  'input.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Input from './input';

const meta = {
  title: 'UI/Input',
  component: Input.Root,
} satisfies Meta<typeof Input.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Input.Root className='max-w-sm'>
      <Input.Wrapper>
        <Input.Input placeholder='Search tenders…' />
      </Input.Wrapper>
    </Input.Root>
  ),
};
`,
  'svg-rating-icons.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { StarRating } from './svg-rating-icons';

const meta = {
  title: 'UI/SvgRatingIcons',
  component: StarRating,
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { rating: 3.5 },
};
`,
  'avatar-empty-icons.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { IconEmptyUser } from './avatar-empty-icons';

const meta = {
  title: 'UI/AvatarEmptyIcons',
  component: IconEmptyUser,
} satisfies Meta<typeof IconEmptyUser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <IconEmptyUser className='size-10 text-text-soft-400' />,
};
`,
  'modal.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Modal from './modal';
import * as Button from './button';

const meta = {
  title: 'UI/Modal',
  component: Modal.Root,
} satisfies Meta<typeof Modal.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button.Root variant='primary' mode='filled'>Open modal</Button.Root>
      </Modal.Trigger>
      <Modal.Content className='max-w-sm'>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
          <Modal.Description>Modal description text.</Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root variant='neutral' mode='stroke'>Close</Button.Root>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  ),
};
`,
  'drawer.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Drawer from './drawer';
import * as Button from './button';

const meta = {
  title: 'UI/Drawer',
  component: Drawer.Root,
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button.Root variant='primary' mode='filled'>Open drawer</Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Drawer title</Drawer.Title>
        </Drawer.Header>
      </Drawer.Content>
    </Drawer.Root>
  ),
};
`,
  'popover.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Popover from './popover';
import * as Button from './button';

const meta = {
  title: 'UI/Popover',
  component: Popover.Root,
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>Open popover</Button.Root>
      </Popover.Trigger>
      <Popover.Content className='w-64'>Popover content</Popover.Content>
    </Popover.Root>
  ),
};
`,
  'dropdown.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Dropdown from './dropdown';
import * as Button from './button';

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown.Root,
} satisfies Meta<typeof Dropdown.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>Open menu</Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ),
};
`,
  'tooltip.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Tooltip from './tooltip';
import * as Button from './button';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip.Root,
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>Hover me</Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Tooltip content</Tooltip.Content>
    </Tooltip.Root>
  ),
};
`,
  'select.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Select from './select';

const meta = {
  title: 'UI/Select',
  component: Select.Root,
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select.Root defaultValue='federal'>
      <Select.Trigger className='w-48'>
        <Select.Value placeholder='Agency type' />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value='federal'>Federal</Select.Item>
        <Select.Item value='state'>State</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
};
`,
  'table.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Table from './table';

const meta = {
  title: 'UI/Table',
  component: Table.Root,
} satisfies Meta<typeof Table.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Agency</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Department of Defense</Table.Cell>
          <Table.Cell>Active</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};
`,
  'avatar.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Avatar from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar.Root,
} satisfies Meta<typeof Avatar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar.Root size='40' color='blue'>
      <Avatar.Image src='https://i.pravatar.cc/80' alt='User' />
    </Avatar.Root>
  ),
};
`,
  'switch.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Switch from './switch';

const meta = {
  title: 'UI/Switch',
  component: Switch.Root,
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Switch.Root defaultChecked />,
};
`,
  'checkbox.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Checkbox from './checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox.Root,
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Checkbox.Root defaultChecked />,
};
`,
  'radio.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Radio from './radio';

const meta = {
  title: 'UI/Radio',
  component: Radio.Group,
} satisfies Meta<typeof Radio.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Radio.Group defaultValue='a'>
      <Radio.Item value='a'>Option A</Radio.Item>
      <Radio.Item value='b'>Option B</Radio.Item>
    </Radio.Group>
  ),
};
`,
  'slider.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Slider from './slider';

const meta = {
  title: 'UI/Slider',
  component: Slider.Root,
} satisfies Meta<typeof Slider.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Slider.Root defaultValue={[40]} className='w-64' />,
};
`,
  'progress-bar.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as ProgressBar from './progress-bar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar.Root,
} satisfies Meta<typeof ProgressBar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProgressBar.Root value={60} className='w-64' />,
};
`,
  'progress-circle.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as ProgressCircle from './progress-circle';

const meta = {
  title: 'UI/ProgressCircle',
  component: ProgressCircle.Root,
} satisfies Meta<typeof ProgressCircle.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProgressCircle.Root value={60} size='48' />,
};
`,
  'divider.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Divider from './divider';

const meta = {
  title: 'UI/Divider',
  component: Divider.Root,
} satisfies Meta<typeof Divider.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Divider.Root className='w-64' />,
};
`,
  'kbd.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Kbd from './kbd';

const meta = {
  title: 'UI/Kbd',
  component: Kbd.Root,
} satisfies Meta<typeof Kbd.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Kbd.Root>⌘K</Kbd.Root>,
};
`,
  'label.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Label from './label';

const meta = {
  title: 'UI/Label',
  component: Label.Root,
} satisfies Meta<typeof Label.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label.Root>Agency name</Label.Root>,
};
`,
  'hint.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Hint from './hint';

const meta = {
  title: 'UI/Hint',
  component: Hint.Root,
} satisfies Meta<typeof Hint.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Hint.Root>Helper text for the field.</Hint.Root>,
};
`,
  'textarea.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Textarea from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea.Root,
} satisfies Meta<typeof Textarea.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Textarea.Root placeholder='Add notes…' className='max-w-sm' />
  ),
};
`,
  'notification.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Notification from './notification';

const meta = {
  title: 'UI/Notification',
  component: Notification.Root,
} satisfies Meta<typeof Notification.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Notification.Provider>
      <Notification.Root
        open
        status='information'
        title='Saved'
        description='Changes saved successfully.'
      />
      <Notification.Viewport />
    </Notification.Provider>
  ),
};
`,
};

function titleCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function defaultStory(fileName) {
  const base = fileName.replace(/\.tsx$/, '');
  const title = titleCase(base);
  const importPath = `./${base}`;

  return `import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import * as Component from '${importPath}';

const Root = 'Root' in Component ? Component.Root : Object.values(Component).find((v) => typeof v === 'function');

const meta = {
  title: 'UI/${title}',
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
`;
}

const files = fs.readdirSync(UI_DIR).filter((f) => f.endsWith('.tsx'));

let created = 0;
for (const file of files) {
  if (SKIP.has(file)) continue;

  const storyPath = path.join(UI_DIR, file.replace('.tsx', '.stories.tsx'));
  const content = OVERRIDES[file] ?? defaultStory(file);
  fs.writeFileSync(storyPath, content);
  created++;
}

console.log(`Generated ${created} story files in components/ui/`);
