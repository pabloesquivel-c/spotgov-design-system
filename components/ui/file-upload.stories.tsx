import type { Meta, StoryObj } from '@storybook/react';
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
