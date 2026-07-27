'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  RiArrowUpDownLine,
  RiCloseLine,
  RiFilter3Line,
  RiMailSendLine,
  RiMore2Line,
  RiSearchLine,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';
import * as StatusBadge from '@/components/ui/status-badge';
import * as Table from '@/components/ui/table';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';

type Role = 'owner' | 'admin' | 'member';
type AssignableRole = Exclude<Role, 'owner'>;
type PersonStatus = 'active' | 'pending';

type Person = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  status: PersonStatus;
  expiresAt?: string;
};

type RoleChange = {
  person: Person;
  nextRole: AssignableRole;
};

type Invitee = {
  id: string;
  email: string;
  role: AssignableRole;
};

const initialPeople: Person[] = [
  {
    id: 'arthur-taylor',
    name: 'Arthur Taylor',
    email: 'arthur@alignui.com',
    initials: 'AT',
    role: 'owner',
    status: 'active',
  },
  {
    id: 'sophia-williams',
    name: 'Sophia Williams',
    email: 'sophia@alignui.com',
    initials: 'SW',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'james-brown',
    name: 'James Brown',
    email: 'james@alignui.com',
    initials: 'JB',
    role: 'member',
    status: 'active',
  },
  {
    id: 'matthew-johnson',
    name: 'Matthew Johnson',
    email: 'matthew@alignui.com',
    initials: 'MJ',
    role: 'member',
    status: 'active',
  },
  {
    id: 'wei-chen',
    name: 'Wei Chen',
    email: 'wei@alignui.com',
    initials: 'WC',
    role: 'member',
    status: 'pending',
    expiresAt: 'Expires in 7 days',
  },
];

const emailPattern = /^\S+@\S+\.\S+$/;

const MEMBER_AVATAR_IMAGES: Record<string, string> = {
  'arthur-taylor': '/images/settings-members/arthur-taylor.png',
  'sophia-williams': '/images/settings-members/sophia-williams.png',
  'james-brown': '/images/settings-members/james-brown.png',
  'matthew-johnson': '/images/settings-members/matthew-johnson.png',
  'wei-chen': '/images/settings-members/wei-chen.png',
};

export type MembersModalSectionProps = {
  onInviteActionChange: (action: (() => void) | null) => void;
};

export function MembersModalSection({
  onInviteActionChange,
}: MembersModalSectionProps) {
  const [people, setPeople] = React.useState<Person[]>(initialPeople);
  const [query, setQuery] = React.useState('');
  const [pendingOnly, setPendingOnly] = React.useState(false);
  const [selectedPersonIds, setSelectedPersonIds] = React.useState<string[]>(
    [],
  );
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [removeTarget, setRemoveTarget] = React.useState<Person | null>(null);
  const [roleChange, setRoleChange] = React.useState<RoleChange | null>(null);

  React.useEffect(() => {
    onInviteActionChange(() => setInviteOpen(true));
    return () => onInviteActionChange(null);
  }, [onInviteActionChange]);

  const matches = people.filter((person) =>
    `${person.name} ${person.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const filteredPeople = pendingOnly
    ? matches.filter((person) => person.status === 'pending')
    : matches;
  const allSelected =
    filteredPeople.length > 0 &&
    filteredPeople.every((person) => selectedPersonIds.includes(person.id));

  const applyRoleChange = () => {
    if (!roleChange) return;

    setPeople((previous) =>
      previous.map((person) =>
        person.id === roleChange.person.id
          ? { ...person, role: roleChange.nextRole }
          : person,
      ),
    );
    notification({
      status: 'success',
      title:
        roleChange.nextRole === 'admin'
          ? `${roleChange.person.name} is now an admin`
          : `${roleChange.person.name} is now a member`,
    });
    setRoleChange(null);
  };

  const removePerson = () => {
    if (!removeTarget) return;

    setPeople((previous) =>
      previous.filter((person) => person.id !== removeTarget.id),
    );
    notification({
      status: 'success',
      title:
        removeTarget.status === 'pending'
          ? 'Invitation canceled'
          : `${removeTarget.name} removed`,
    });
    setRemoveTarget(null);
  };

  const addPendingInvitations = (invitees: Invitee[]) => {
    setPeople((previous) => [
      ...previous,
      ...invitees.map((invitee) => ({
        id: `invite-${invitee.email}`,
        name: invitee.email,
        email: invitee.email,
        initials: invitee.email.charAt(0).toUpperCase(),
        role: invitee.role,
        status: 'pending' as const,
        expiresAt: 'Expires in 7 days',
      })),
    ]);
    setInviteOpen(false);
    notification({
      status: 'success',
      title:
        invitees.length === 1
          ? 'Invitation sent'
          : `${invitees.length} invitations sent`,
    });
  };

  const togglePerson = (personId: string, checked: boolean) => {
    setSelectedPersonIds((current) =>
      checked
        ? [...new Set([...current, personId])]
        : current.filter((id) => id !== personId),
    );
  };

  const toggleAllPeople = (checked: boolean) => {
    setSelectedPersonIds((current) =>
      checked
        ? [
            ...new Set([
              ...current,
              ...filteredPeople.map((person) => person.id),
            ]),
          ]
        : current.filter(
            (id) => !filteredPeople.some((person) => person.id === id),
          ),
    );
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Input.Root size='xsmall' className='w-full sm:max-w-[300px]'>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                aria-label='Search members'
                placeholder='Search members'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Input.Affix className='pr-1'>
                <Kbd.Root>⌘1</Kbd.Root>
              </Input.Affix>
            </Input.Wrapper>
          </Input.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            aria-pressed={pendingOnly}
            onClick={() => setPendingOnly((current) => !current)}
          >
            <Button.Icon as={RiFilter3Line} />
            Filter
          </Button.Root>
        </div>

        <MembersTable
          people={filteredPeople}
          selectedPersonIds={selectedPersonIds}
          allSelected={allSelected}
          onToggleAll={toggleAllPeople}
          onTogglePerson={togglePerson}
          onRemove={setRemoveTarget}
          onRoleChange={setRoleChange}
          onSendInvite={(person) =>
            notification({
              status: 'success',
              title: `Invitation resent to ${person.email}`,
            })
          }
        />
      </div>

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        existingEmails={people.map((person) => person.email)}
        onInvite={addPendingInvitations}
      />

      <RoleConfirmModal
        roleChange={roleChange}
        onOpenChange={(open) => !open && setRoleChange(null)}
        onConfirm={applyRoleChange}
      />

      <DestructiveConfirmModal
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={
          removeTarget?.status === 'pending'
            ? `Cancel invitation for ${removeTarget.email}?`
            : `Remove ${removeTarget?.name ?? 'member'}?`
        }
        description={
          removeTarget?.status === 'pending'
            ? 'This person will no longer be able to use the invitation link.'
            : 'This person will lose access to the organization.'
        }
        confirmLabel={
          removeTarget?.status === 'pending'
            ? 'Cancel invitation'
            : 'Remove member'
        }
        onConfirm={removePerson}
      />
    </>
  );
}

function MembersTable({
  people,
  selectedPersonIds,
  allSelected,
  onToggleAll,
  onTogglePerson,
  onRemove,
  onRoleChange,
  onSendInvite,
}: {
  people: Person[];
  selectedPersonIds: string[];
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  onTogglePerson: (personId: string, checked: boolean) => void;
  onRemove: (person: Person) => void;
  onRoleChange: (change: RoleChange) => void;
  onSendInvite: (person: Person) => void;
}) {
  if (!people.length) {
    return (
      <div className='flex min-h-48 flex-col items-center justify-center px-6 text-center'>
        <p className='text-label-sm text-text-strong-950'>No members found</p>
        <p className='mt-1 text-paragraph-xs text-text-sub-600'>
          Adjust the search or filter to see members.
        </p>
      </div>
    );
  }

  return (
    <Table.Root>
      <colgroup>
        <col className='w-[38%]' />
        <col className='w-[30%]' />
        <col className='w-[24%]' />
        <col className='w-12' />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head className='h-9 p-0 align-middle'>
            <div className='flex items-center gap-2.5 px-3 py-2'>
              <Checkbox.Root
                checked={allSelected}
                aria-label='Select all members'
                onCheckedChange={(checked) => onToggleAll(checked === true)}
              />
              <TableColumnLabel>User</TableColumnLabel>
            </div>
          </Table.Head>
          <Table.Head className='h-9 p-0 align-middle'>
            <div className='px-3 py-2'>
              <TableColumnLabel>Email address</TableColumnLabel>
            </div>
          </Table.Head>
          <Table.Head className='h-9 p-0 align-middle'>
            <div className='px-3 py-2'>
              <TableColumnLabel>Role</TableColumnLabel>
            </div>
          </Table.Head>
          <Table.Head className='h-9 p-0' aria-label='Actions' />
        </Table.Row>
      </Table.Header>
      <Table.Body spacing={8}>
        {people.map((person, index) => (
          <React.Fragment key={person.id}>
            {index > 0 && <Table.RowDivider />}
            <Table.Row>
              <Table.Cell className='h-12 py-3'>
                <div className='flex min-w-0 items-center gap-3'>
                  <Checkbox.Root
                    checked={selectedPersonIds.includes(person.id)}
                    aria-label={`Select ${person.name}`}
                    onCheckedChange={(checked) =>
                      onTogglePerson(person.id, checked === true)
                    }
                  />
                  <MemberAvatar person={person} />
                  <span className='truncate text-label-sm text-text-strong-950'>
                    {person.name}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell className='h-12 py-3'>
                <span className='block truncate text-paragraph-sm text-text-sub-600'>
                  {person.email}
                </span>
              </Table.Cell>
              <Table.Cell className='h-12 py-3'>
                <MemberRoleBadge person={person} />
              </Table.Cell>
              <Table.Cell className='h-12 px-3 py-3 text-center'>
                <MemberActions
                  person={person}
                  onRemove={onRemove}
                  onRoleChange={onRoleChange}
                  onSendInvite={onSendInvite}
                />
              </Table.Cell>
            </Table.Row>
          </React.Fragment>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

function TableColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className='flex items-center gap-0.5 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
      {children}
      <RiArrowUpDownLine className='size-5' aria-hidden='true' />
    </span>
  );
}

function MemberAvatar({ person }: { person: Person }) {
  const src = MEMBER_AVATAR_IMAGES[person.id];

  if (src) {
    return (
      <Image
        src={src}
        alt=''
        width={24}
        height={24}
        className='size-6 shrink-0 rounded-full object-cover'
      />
    );
  }

  return (
    <Avatar.Root size='24' color='gray'>
      {person.initials}
    </Avatar.Root>
  );
}

function MemberRoleBadge({ person }: { person: Person }) {
  const label =
    person.status === 'pending'
      ? 'Pending invitation'
      : person.role[0].toUpperCase() + person.role.slice(1);
  const status =
    person.status === 'pending'
      ? 'pending'
      : person.role === 'admin'
        ? 'completed'
        : 'disabled';

  return (
    <StatusBadge.Root variant='stroke' status={status}>
      <StatusBadge.Dot />
      {label}
    </StatusBadge.Root>
  );
}

function MemberActions({
  person,
  onRemove,
  onRoleChange,
  onSendInvite,
}: {
  person: Person;
  onRemove: (person: Person) => void;
  onRoleChange: (change: RoleChange) => void;
  onSendInvite: (person: Person) => void;
}) {
  if (person.role === 'owner') {
    return (
      <RiMore2Line className='size-5 text-text-sub-600' aria-hidden='true' />
    );
  }

  const isPending = person.status === 'pending';

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <CompactButton.Root
          variant='ghost'
          size='large'
          aria-label={`Actions for ${person.name}`}
        >
          <CompactButton.Icon as={RiMore2Line} />
        </CompactButton.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align='end' className='w-[220px]'>
        {isPending ? (
          <>
            <Dropdown.Item onSelect={() => onSendInvite(person)}>
              Resend invite
            </Dropdown.Item>
            <Dropdown.Item
              className='text-error-base data-[highlighted]:text-error-base'
              onSelect={() => onRemove(person)}
            >
              Cancel invitation
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item
              onSelect={() =>
                onRoleChange({
                  person,
                  nextRole: person.role === 'admin' ? 'member' : 'admin',
                })
              }
            >
              {person.role === 'admin' ? 'Make member' : 'Make admin'}
            </Dropdown.Item>
            <Dropdown.Item
              className='text-error-base data-[highlighted]:text-error-base'
              onSelect={() => onRemove(person)}
            >
              Remove member
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function InviteModal({
  open,
  onOpenChange,
  existingEmails,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEmails: string[];
  onInvite: (invitees: Invitee[]) => void;
}) {
  const [emailInput, setEmailInput] = React.useState('');
  const [invitees, setInvitees] = React.useState<Invitee[]>([]);

  const parseInvitees = (value: string, blockedEmails = invitees) => {
    const existing = new Set([
      ...existingEmails.map((email) => email.toLowerCase()),
      ...blockedEmails.map((invitee) => invitee.email.toLowerCase()),
    ]);

    return value
      .split(/[\s,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => emailPattern.test(email) && !existing.has(email))
      .map((email) => ({
        id: email,
        email,
        role: 'member' as const,
      }));
  };

  const reset = React.useCallback(() => {
    setEmailInput('');
    setInvitees([]);
  }, []);

  const addEmails = (value: string) => {
    const nextInvitees = parseInvitees(value);

    if (nextInvitees.length) {
      setInvitees((previous) => [...previous, ...nextInvitees]);
    }
    setEmailInput('');
  };

  const updateRole = (id: string, role: AssignableRole) => {
    setInvitees((previous) =>
      previous.map((invitee) =>
        invitee.id === id ? { ...invitee, role } : invitee,
      ),
    );
  };

  const removeInvitee = (id: string) => {
    setInvitees((previous) => previous.filter((invitee) => invitee.id !== id));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  const handleSend = () => {
    const draftInvitees = parseInvitees(emailInput, invitees);
    const nextInvitees = [...invitees, ...draftInvitees];

    onInvite(nextInvitees);
    reset();
  };

  const hasValidDraft = emailPattern.test(emailInput.trim());

  return (
    <Modal.Root open={open} onOpenChange={handleOpenChange}>
      <Modal.Content className='max-w-[520px]'>
        <Modal.Header
          title='Invite members'
          description='Invites are emailed and expire after 7 days.'
        />
        <Modal.Body className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='invite-emails'>Email addresses</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='invite-emails'
                  placeholder='name@company.com'
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' ||
                      event.key === ',' ||
                      event.key === ';'
                    ) {
                      event.preventDefault();
                      addEmails(emailInput);
                    }
                  }}
                  onPaste={(event) => {
                    const pasted = event.clipboardData.getData('text');
                    if (/[\s,;]/.test(pasted)) {
                      event.preventDefault();
                      addEmails(pasted);
                    }
                  }}
                />
              </Input.Wrapper>
            </Input.Root>
            <p className='text-paragraph-xs text-text-sub-600'>
              Type an email, then press Enter. Commas, semicolons, and pasted
              lists are supported.
            </p>
          </div>

          {invitees.length ? (
            <ul className='divide-y divide-stroke-soft-200 overflow-hidden rounded-2xl ring-1 ring-inset ring-stroke-soft-200'>
              {invitees.map((invitee) => (
                <li key={invitee.id} className='flex items-center gap-3 p-3'>
                  <span className='min-w-0 flex-1 truncate text-label-sm text-text-strong-950'>
                    {invitee.email}
                  </span>
                  <Select.Root
                    value={invitee.role}
                    size='small'
                    variant='compact'
                    onValueChange={(value) =>
                      updateRole(invitee.id, value as AssignableRole)
                    }
                  >
                    <Select.Trigger aria-label={`Role for ${invitee.email}`}>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='member'>Member</Select.Item>
                      <Select.Item value='admin'>Admin</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <CompactButton.Root
                    variant='ghost'
                    size='large'
                    aria-label={`Remove ${invitee.email}`}
                    onClick={() => removeInvitee(invitee.id)}
                  >
                    <CompactButton.Icon as={RiCloseLine} />
                  </CompactButton.Root>
                </li>
              ))}
            </ul>
          ) : (
            <div className='rounded-2xl bg-bg-weak-50 p-4 text-paragraph-sm text-text-sub-600'>
              No invitees added yet.
            </div>
          )}

          <p className='text-paragraph-xs text-text-sub-600'>
            4 of 10 seats remaining.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            className='w-full'
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button.Root>
          <Button.Root
            variant='primary'
            size='small'
            className='w-full'
            disabled={!invitees.length && !hasValidDraft}
            onClick={handleSend}
          >
            <Button.Icon as={RiMailSendLine} />
            Send invite
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}

function RoleConfirmModal({
  roleChange,
  onOpenChange,
  onConfirm,
}: {
  roleChange: RoleChange | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Modal.Root open={roleChange !== null} onOpenChange={onOpenChange}>
      <Modal.Content showClose={false} className='max-w-[440px]'>
        <Modal.Header
          title={
            roleChange?.nextRole === 'admin'
              ? `Make ${roleChange.person.name} an admin?`
              : `Make ${roleChange?.person.name ?? 'member'} a member?`
          }
          description={
            roleChange?.nextRole === 'admin'
              ? 'Admins can manage members and organization settings.'
              : 'Members keep access, but can no longer manage organization settings.'
          }
        />
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              className='w-full'
            >
              Cancel
            </Button.Root>
          </Modal.Close>
          <Button.Root
            variant='primary'
            size='small'
            className='w-full'
            onClick={onConfirm}
          >
            {roleChange?.nextRole === 'admin' ? 'Make admin' : 'Make member'}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
