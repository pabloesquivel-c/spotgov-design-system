'use client';

import * as React from 'react';
import { RiCloseLine, RiSparklingLine } from '@remixicon/react';

import * as Banner from '@/components/ui/banner';

export type ProductAnnouncementBannerProps = {
  message: string;
  onDismiss?: () => void;
  defaultVisible?: boolean;
};

export function ProductAnnouncementBanner({
  message,
  onDismiss,
  defaultVisible = true,
}: ProductAnnouncementBannerProps) {
  const [visible, setVisible] = React.useState(defaultVisible);

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <Banner.Root variant='filled' status='feature'>
      <Banner.Content className='text-label-sm'>{message}</Banner.Content>
      <Banner.Icon as={RiSparklingLine} aria-hidden />
      <Banner.CloseButton aria-label='Dismiss announcement' onClick={handleDismiss}>
        <RiCloseLine className='size-5' />
      </Banner.CloseButton>
    </Banner.Root>
  );
}

export function ProposalAiAnnouncementBanner() {
  return (
    <ProductAnnouncementBanner message='Proposal AI is now available for your workspace.' />
  );
}
