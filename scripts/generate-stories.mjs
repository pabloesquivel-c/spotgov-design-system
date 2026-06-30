#!/usr/bin/env node
/**
 * Generates Storybook stories for components/ui.
 * Re-run after adding primitives: node scripts/generate-stories.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const UI_DIR = path.join(process.cwd(), 'components/ui');
const SKIP = new Set(['notification-provider.tsx']);

function titleCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Per-component story source. Keys are filenames in components/ui/. */
const STORY_TEMPLATES = {
  'accordion.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Accordion from './accordion';

const meta = { title: 'UI/Accordion', component: Accordion.Root } satisfies Meta<typeof Accordion.Root>;
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
import { RiInformationLine } from '@remixicon/react';
import * as Alert from './alert';

const meta = { title: 'UI/Alert', component: Alert.Root } satisfies Meta<typeof Alert.Root>;
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
  'avatar.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Avatar from './avatar';

const meta = { title: 'UI/Avatar', component: Avatar.Root } satisfies Meta<typeof Avatar.Root>;
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
  'avatar-empty-icons.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { IconEmptyUser } from './avatar-empty-icons';

const meta = { title: 'UI/AvatarEmptyIcons', component: IconEmptyUser } satisfies Meta<typeof IconEmptyUser>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <IconEmptyUser className='size-10 text-text-soft-400' />,
};
`,
  'avatar-group.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Avatar from './avatar';
import * as AvatarGroup from './avatar-group';

const meta = { title: 'UI/AvatarGroup', component: AvatarGroup.Root } satisfies Meta<typeof AvatarGroup.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AvatarGroup.Root size='32'>
      <Avatar.Root size='32' color='blue'><Avatar.Image src='https://i.pravatar.cc/80?img=1' alt='' /></Avatar.Root>
      <Avatar.Root size='32' color='green'><Avatar.Image src='https://i.pravatar.cc/80?img=2' alt='' /></Avatar.Root>
      <Avatar.Root size='32' color='orange'><Avatar.Image src='https://i.pravatar.cc/80?img=3' alt='' /></Avatar.Root>
    </AvatarGroup.Root>
  ),
};
`,
  'avatar-group-compact.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Avatar from './avatar';
import * as AvatarGroupCompact from './avatar-group-compact';

const meta = { title: 'UI/AvatarGroupCompact', component: AvatarGroupCompact.Root } satisfies Meta<typeof AvatarGroupCompact.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AvatarGroupCompact.Root size='24'>
      <Avatar.Root size='24' color='blue'><Avatar.Image src='https://i.pravatar.cc/80?img=4' alt='' /></Avatar.Root>
      <Avatar.Root size='24' color='green'><Avatar.Image src='https://i.pravatar.cc/80?img=5' alt='' /></Avatar.Root>
    </AvatarGroupCompact.Root>
  ),
};
`,
  'badge.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Badge from './badge';

const meta = { title: 'UI/Badge', component: Badge.Root } satisfies Meta<typeof Badge.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Badge.Root variant='filled' color='blue'>Federal</Badge.Root>,
};
`,
  'breadcrumb.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Breadcrumb from './breadcrumb';

const meta = { title: 'UI/Breadcrumb', component: Breadcrumb.Root } satisfies Meta<typeof Breadcrumb.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb.Root>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.ArrowIcon />
      <Breadcrumb.Item active>Tenders</Breadcrumb.Item>
    </Breadcrumb.Root>
  ),
};
`,
  'button.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';

const meta = { title: 'UI/Button', component: Button.Root } satisfies Meta<typeof Button.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Button.Root variant='primary' mode='filled'>Primary</Button.Root>,
};
`,
  'button-group.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as ButtonGroup from './button-group';

const meta = { title: 'UI/ButtonGroup', component: ButtonGroup.Root } satisfies Meta<typeof ButtonGroup.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup.Root>
      <ButtonGroup.Item>Left</ButtonGroup.Item>
      <ButtonGroup.Item>Center</ButtonGroup.Item>
      <ButtonGroup.Item>Right</ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};
`,
  'checkbox.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Checkbox from './checkbox';

const meta = { title: 'UI/Checkbox', component: Checkbox.Root } satisfies Meta<typeof Checkbox.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Checkbox.Root defaultChecked />,
};
`,
  'color-picker.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as ColorPicker from './color-picker';

const meta = { title: 'UI/ColorPicker', component: ColorPicker.Root } satisfies Meta<typeof ColorPicker.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ColorPicker.Root defaultValue='#2e6ad6'>
      <ColorPicker.Area colorSpace='hsb' xChannel='saturation' yChannel='brightness' />
    </ColorPicker.Root>
  ),
};
`,
  'command-menu.tsx': `import type { Meta, StoryObj } from '@storybook/react';
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
`,
  'compact-button.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { RiAddLine } from '@remixicon/react';
import * as CompactButton from './compact-button';

const meta = { title: 'UI/CompactButton', component: CompactButton.Root } satisfies Meta<typeof CompactButton.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CompactButton.Root variant='stroke' size='large'>
      <CompactButton.Icon as={RiAddLine} />
    </CompactButton.Root>
  ),
};
`,
  'datepicker.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './datepicker';

const meta = { title: 'UI/Datepicker', component: Calendar } satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar mode='single' />,
};
`,
  'digit-input.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as DigitInput from './digit-input';

const meta = { title: 'UI/DigitInput', component: DigitInput.Root } satisfies Meta<typeof DigitInput.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DigitInput.Root numInputs={4} />,
};
`,
  'divider.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Divider from './divider';

const meta = { title: 'UI/Divider', component: Divider.Root } satisfies Meta<typeof Divider.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Divider.Root className='w-64' />,
};
`,
  'dot-stepper.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as DotStepper from './dot-stepper';

const meta = { title: 'UI/DotStepper', component: DotStepper.Root } satisfies Meta<typeof DotStepper.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DotStepper.Root>
      <DotStepper.Item active />
      <DotStepper.Item />
      <DotStepper.Item />
    </DotStepper.Root>
  ),
};
`,
  'drawer.tsx': `import type { Meta, StoryObj } from '@storybook/react';
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
`,
  'dropdown.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';
import * as Dropdown from './dropdown';

const meta = { title: 'UI/Dropdown', component: Dropdown.Root } satisfies Meta<typeof Dropdown.Root>;
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
  'fancy-button.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { RiSparklingLine } from '@remixicon/react';
import * as FancyButton from './fancy-button';

const meta = { title: 'UI/FancyButton', component: FancyButton.Root } satisfies Meta<typeof FancyButton.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FancyButton.Root variant='primary'>
      <FancyButton.Icon as={RiSparklingLine} />
      Fancy action
    </FancyButton.Root>
  ),
};
`,
  'file-format-icon.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as FileFormatIcon from './file-format-icon';

const meta = { title: 'UI/FileFormatIcon', component: FileFormatIcon.Root } satisfies Meta<typeof FileFormatIcon.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FileFormatIcon.Root format='pdf' />,
};
`,
  'file-upload.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { RiUploadCloud2Line } from '@remixicon/react';
import * as FileUpload from './file-upload';

const meta = { title: 'UI/FileUpload', component: FileUpload.Root } satisfies Meta<typeof FileUpload.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FileUpload.Root className='max-w-md'>
      <FileUpload.Icon as={RiUploadCloud2Line} />
      <div>
        <p className='text-label-sm text-text-strong-950'>Upload documents</p>
        <p className='text-paragraph-sm text-text-sub-600'>PDF, DOCX up to 10MB</p>
      </div>
      <FileUpload.Button>Browse files</FileUpload.Button>
    </FileUpload.Root>
  ),
};
`,
  'hint.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Hint from './hint';

const meta = { title: 'UI/Hint', component: Hint.Root } satisfies Meta<typeof Hint.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Hint.Root>Helper text for the field.</Hint.Root>,
};
`,
  'horizontal-stepper.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as HorizontalStepper from './horizontal-stepper';

const meta = { title: 'UI/HorizontalStepper', component: HorizontalStepper.Root } satisfies Meta<typeof HorizontalStepper.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HorizontalStepper.Root className='max-w-lg'>
      <HorizontalStepper.Item state='completed'>
        <HorizontalStepper.ItemIndicator>1</HorizontalStepper.ItemIndicator>
        Draft
      </HorizontalStepper.Item>
      <HorizontalStepper.SeparatorIcon />
      <HorizontalStepper.Item state='active'>
        <HorizontalStepper.ItemIndicator>2</HorizontalStepper.ItemIndicator>
        Review
      </HorizontalStepper.Item>
    </HorizontalStepper.Root>
  ),
};
`,
  'input.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Input from './input';

const meta = { title: 'UI/Input', component: Input.Root } satisfies Meta<typeof Input.Root>;
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
  'kbd.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Kbd from './kbd';

const meta = { title: 'UI/Kbd', component: Kbd.Root } satisfies Meta<typeof Kbd.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Kbd.Root>⌘K</Kbd.Root>,
};
`,
  'label.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Label from './label';

const meta = { title: 'UI/Label', component: Label.Root } satisfies Meta<typeof Label.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label.Root>Agency name</Label.Root>,
};
`,
  'link-button.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { RiArrowRightLine } from '@remixicon/react';
import * as LinkButton from './link-button';

const meta = { title: 'UI/LinkButton', component: LinkButton.Root } satisfies Meta<typeof LinkButton.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <LinkButton.Root variant='primary'>
      View details
      <LinkButton.Icon as={RiArrowRightLine} />
    </LinkButton.Root>
  ),
};
`,
  'modal.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';
import * as Modal from './modal';

const meta = { title: 'UI/Modal', component: Modal.Root } satisfies Meta<typeof Modal.Root>;
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
  'notification.tsx': `import type { Meta, StoryObj } from '@storybook/react';
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
`,
  'pagination.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import * as Pagination from './pagination';

const meta = { title: 'UI/Pagination', component: Pagination.Root } satisfies Meta<typeof Pagination.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pagination.Root variant='basic'>
      <Pagination.NavButton>
        <Pagination.NavIcon as={RiArrowLeftSLine} />
      </Pagination.NavButton>
      <Pagination.Item active>1</Pagination.Item>
      <Pagination.Item>2</Pagination.Item>
      <Pagination.Item>3</Pagination.Item>
      <Pagination.NavButton>
        <Pagination.NavIcon as={RiArrowRightSLine} />
      </Pagination.NavButton>
    </Pagination.Root>
  ),
};
`,
  'popover.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';
import * as Popover from './popover';

const meta = { title: 'UI/Popover', component: Popover.Root } satisfies Meta<typeof Popover.Root>;
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
  'progress-bar.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as ProgressBar from './progress-bar';

const meta = { title: 'UI/ProgressBar', component: ProgressBar.Root } satisfies Meta<typeof ProgressBar.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProgressBar.Root value={60} className='w-64' />,
};
`,
  'progress-circle.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as ProgressCircle from './progress-circle';

const meta = { title: 'UI/ProgressCircle', component: ProgressCircle.Root } satisfies Meta<typeof ProgressCircle.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ProgressCircle.Root value={60} size='48' />,
};
`,
  'radio.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Radio from './radio';

const meta = { title: 'UI/Radio', component: Radio.Group } satisfies Meta<typeof Radio.Group>;
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
  'segmented-control.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as SegmentedControl from './segmented-control';

const meta = { title: 'UI/SegmentedControl', component: SegmentedControl.Root } satisfies Meta<typeof SegmentedControl.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SegmentedControl.Root defaultValue='list' className='w-64'>
      <SegmentedControl.List>
        <SegmentedControl.Trigger value='list'>List</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='board'>Board</SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  ),
};
`,
  'select.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Select from './select';

const meta = { title: 'UI/Select', component: Select.Root } satisfies Meta<typeof Select.Root>;
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
  'slider.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Slider from './slider';

const meta = { title: 'UI/Slider', component: Slider.Root } satisfies Meta<typeof Slider.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Slider.Root defaultValue={[40]} className='w-64' />,
};
`,
  'social-button.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { RiGoogleFill } from '@remixicon/react';
import * as SocialButton from './social-button';

const meta = { title: 'UI/SocialButton', component: SocialButton.Root } satisfies Meta<typeof SocialButton.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SocialButton.Root brand='google'>
      <SocialButton.Icon as={RiGoogleFill} />
      Continue with Google
    </SocialButton.Root>
  ),
};
`,
  'status-badge.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as StatusBadge from './status-badge';

const meta = { title: 'UI/StatusBadge', component: StatusBadge.Root } satisfies Meta<typeof StatusBadge.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <StatusBadge.Root variant='light' status='completed'>Completed</StatusBadge.Root>,
};
`,
  'svg-rating-icons.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import { StarRating } from './svg-rating-icons';

const meta = { title: 'UI/SvgRatingIcons', component: StarRating } satisfies Meta<typeof StarRating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { rating: 3.5 },
};
`,
  'switch.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Switch from './switch';

const meta = { title: 'UI/Switch', component: Switch.Root } satisfies Meta<typeof Switch.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Switch.Root defaultChecked />,
};
`,
  'tab-menu-horizontal.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as TabMenuHorizontal from './tab-menu-horizontal';

const meta = { title: 'UI/TabMenuHorizontal', component: TabMenuHorizontal.Root } satisfies Meta<typeof TabMenuHorizontal.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TabMenuHorizontal.Root defaultValue='active'>
      <TabMenuHorizontal.List>
        <TabMenuHorizontal.Trigger value='active'>Active</TabMenuHorizontal.Trigger>
        <TabMenuHorizontal.Trigger value='archived'>Archived</TabMenuHorizontal.Trigger>
      </TabMenuHorizontal.List>
    </TabMenuHorizontal.Root>
  ),
};
`,
  'tab-menu-vertical.tsx': `import type { Meta, StoryObj } from '@storybook/react';
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
`,
  'table.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Table from './table';

const meta = { title: 'UI/Table', component: Table.Root } satisfies Meta<typeof Table.Root>;
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
  'tag.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Tag from './tag';

const meta = { title: 'UI/Tag', component: Tag.Root } satisfies Meta<typeof Tag.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Tag.Root>Procurement</Tag.Root>,
};
`,
  'textarea.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Textarea from './textarea';

const meta = { title: 'UI/Textarea', component: Textarea.Root } satisfies Meta<typeof Textarea.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Textarea.Root placeholder='Add notes…' className='max-w-sm' />,
};
`,
  'tooltip.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';
import * as Tooltip from './tooltip';

const meta = { title: 'UI/Tooltip', component: Tooltip.Root } satisfies Meta<typeof Tooltip.Root>;
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
  'vertical-stepper.tsx': `import type { Meta, StoryObj } from '@storybook/react';
import * as VerticalStepper from './vertical-stepper';

const meta = { title: 'UI/VerticalStepper', component: VerticalStepper.Root } satisfies Meta<typeof VerticalStepper.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <VerticalStepper.Root className='max-w-sm'>
      <VerticalStepper.Item state='completed'>
        <VerticalStepper.ItemIndicator>1</VerticalStepper.ItemIndicator>
        Intake
      </VerticalStepper.Item>
      <VerticalStepper.Item state='active'>
        <VerticalStepper.ItemIndicator>2</VerticalStepper.ItemIndicator>
        Review
      </VerticalStepper.Item>
    </VerticalStepper.Root>
  ),
};
`,
};

function fallbackStory(fileName) {
  const base = fileName.replace(/\.tsx$/, '');
  const title = titleCase(base);
  return `import type { Meta, StoryObj } from '@storybook/react';
import * as Component from './${base}';

const meta = { title: 'UI/${title}', component: Component.Root } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <div className='text-paragraph-sm text-text-sub-600'>Add a story for ${title}.</div>,
};
`;
}

const files = fs
  .readdirSync(UI_DIR)
  .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'));
let created = 0;

for (const file of files) {
  if (SKIP.has(file)) continue;
  const storyPath = path.join(UI_DIR, file.replace('.tsx', '.stories.tsx'));
  const content = STORY_TEMPLATES[file] ?? fallbackStory(file);
  fs.writeFileSync(storyPath, content);
  created++;
}

console.log(`Generated ${created} story files in components/ui/`);
