import type { Meta, StoryObj } from '@storybook/react';

import { ProposalAiAnnouncementBanner } from './product-announcement-banner';

const meta = {
  title: 'Blocks/Banner',
  component: ProposalAiAnnouncementBanner,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ProposalAiAnnouncementBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductAnnouncement: Story = {
  render: () => <ProposalAiAnnouncementBanner />,
};
