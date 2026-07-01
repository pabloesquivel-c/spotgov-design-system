import type { Meta, StoryObj } from '@storybook/react';
import {
  AddWriterModal,
  AvatarUploadVariants,
  CsvImportModal,
  DesignSpaceSetupForm,
  FileUploadModal,
  FileUploadStatusCards,
  MultiSourceUploadModal,
  ProfileImageUploadModal,
} from './index';

const meta = {
  title: 'Blocks/FileUpload',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusCards: Story = {
  render: () => <FileUploadStatusCards />,
};

export const AvatarUpload: Story = {
  render: () => <AvatarUploadVariants />,
};

export const UploadModal: Story = {
  render: () => <FileUploadModal />,
};

export const CsvImport: Story = {
  render: () => <CsvImportModal />,
};

export const MultiSourceUpload: Story = {
  render: () => <MultiSourceUploadModal />,
};

export const ProfileImageUpload: Story = {
  render: () => <ProfileImageUploadModal />,
};

export const AddWriter: Story = {
  render: () => <AddWriterModal />,
};

export const DesignSpaceSetup: Story = {
  render: () => <DesignSpaceSetupForm />,
  parameters: {
    layout: 'padded',
  },
};
