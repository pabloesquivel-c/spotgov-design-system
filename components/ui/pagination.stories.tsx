import type { Meta, StoryObj } from '@storybook/react';
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
