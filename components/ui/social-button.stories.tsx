import type { Meta, StoryObj } from '@storybook/react';
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
