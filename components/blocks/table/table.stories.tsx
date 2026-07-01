import type { Meta, StoryObj } from '@storybook/react';
import {
  ContractsTable,
  CoursesTable,
  DocumentsTable,
  PayrollTable,
  ProjectsTable,
  TransactionsLedgerTable,
} from './index';

const meta = {
  title: 'Blocks/Table',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contracts: Story = {
  render: () => <ContractsTable />,
};

export const Projects: Story = {
  render: () => <ProjectsTable />,
};

export const Documents: Story = {
  render: () => <DocumentsTable />,
};

export const Courses: Story = {
  render: () => <CoursesTable />,
};

export const Payroll: Story = {
  render: () => <PayrollTable />,
};

export const TransactionsLedger: Story = {
  render: () => <TransactionsLedgerTable />,
};
