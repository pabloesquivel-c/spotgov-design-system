'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  RiAddLine,
  RiAlertLine,
  RiArrowUpDownLine,
  RiCloseLine,
  RiFilter3Line,
  RiMore2Line,
  RiSearchLine,
  RiUserAddLine,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as CompactButton from '@/components/ui/compact-button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';
import * as StatusBadge from '@/components/ui/status-badge';
import * as Table from '@/components/ui/table';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';
import { cn } from '@/utils/cn';

import { LinkButton } from './link-button';
import {
  DEFAULT_BILLING_PLAN,
  DEFAULT_MEMBERS,
  MEMBER_ROLE_LABEL,
  type Member,
  type MemberRole,
} from './mock-data';

const ORG_DOMAIN = 'acmecorp.com';
const ORG_NAME = 'Acme Corporation';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Invitee = { id: number; email: string; role: MemberRole };

const MEMBER_AVATAR_IMAGES: Record<string, string> = {
  'arthur-taylor': '/images/settings-members/arthur-taylor.png',
  'sophia-williams': '/images/settings-members/sophia-williams.png',
  'james-brown': '/images/settings-members/james-brown.png',
  'matthew-johnson': '/images/settings-members/matthew-johnson.png',
  'wei-chen': '/images/settings-members/wei-chen.png',
};

export function MembersSection() {
  const [members, setMembers] = React.useState<Member[]>(DEFAULT_MEMBERS);
  const [query, setQuery] = React.useState('');
  const [pendingOnly, setPendingOnly] = React.useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = React.useState<string[]>(
    [],
  );

  // confirm-remove / confirm-cancel state
  const [pendingRemoval, setPendingRemoval] = React.useState<Member | null>(
    null,
  );

  // confirm-role-change state
  const [pendingRoleChange, setPendingRoleChange] = React.useState<{
    member: Member;
    role: MemberRole;
  } | null>(null);

  // invite modal state
  const [inviteOpen, setInviteOpen] = React.useState(false);

  const q = query.trim().toLowerCase();
  const visibleMembers = q
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
      )
    : members;
  const filteredMembers = pendingOnly
    ? visibleMembers.filter((member) => member.status === 'pending')
    : visibleMembers;
  const allSelected =
    filteredMembers.length > 0 &&
    filteredMembers.every((member) => selectedMemberIds.includes(member.id));

  const seatsRemaining = Math.max(
    0,
    DEFAULT_BILLING_PLAN.seatsTotal - members.length,
  );

  // TODO(connect): call the change-member-role mutation.
  const applyRoleChange = (id: string, role: MemberRole) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    if (member) {
      notification({
        status: 'success',
        title: `${member.name} is now ${MEMBER_ROLE_LABEL[role]}`,
      });
    }
  };

  // Role changes are consequential (they grant or revoke access to billing,
  // integrations, and org settings) so they're confirmed before applying,
  // naming what the target role can or can't do — see RoleChangeConfirmModal.
  const requestRoleChange = (id: string, role: MemberRole) => {
    const member = members.find((m) => m.id === id);
    if (!member || member.role === role) return;
    setPendingRoleChange({ member, role });
  };

  const confirmRoleChange = () => {
    if (!pendingRoleChange) return;
    applyRoleChange(pendingRoleChange.member.id, pendingRoleChange.role);
    setPendingRoleChange(null);
  };

  // TODO(connect): call the remove-member / cancel-invite mutation.
  const confirmRemoval = () => {
    if (!pendingRemoval) return;
    const removed = pendingRemoval;
    setMembers((prev) => prev.filter((m) => m.id !== removed.id));
    setPendingRemoval(null);
    notification({
      status: 'information',
      title:
        removed.status === 'pending'
          ? 'Invitation cancelled'
          : `${removed.name} removed`,
    });
  };

  // TODO(connect): call the resend-invitation mutation.
  const resendInvite = (member: Member) =>
    notification({
      status: 'success',
      title: `Invitation resent to ${member.email}`,
    });

  // TODO(connect): call the send-invitations mutation.
  const handleSend = (invitees: Invitee[]) => {
    const nextMembers: Member[] = invitees.map((invitee) => ({
      id: `invite-${invitee.email.toLowerCase()}`,
      name: invitee.email,
      email: invitee.email,
      initials: invitee.email[0]?.toUpperCase() ?? '?',
      role: invitee.role,
      status: 'pending',
      color: 'gray',
      expiresInDays: 7,
    }));
    setMembers((prev) => [...prev, ...nextMembers]);
    setInviteOpen(false);
    notification({
      status: 'success',
      title:
        nextMembers.length === 1
          ? 'Invitation sent'
          : `${nextMembers.length} invitations sent`,
    });
  };

  const toggleMember = (memberId: string, checked: boolean) => {
    setSelectedMemberIds((current) =>
      checked
        ? [...new Set([...current, memberId])]
        : current.filter((id) => id !== memberId),
    );
  };

  const toggleAllMembers = (checked: boolean) => {
    setSelectedMemberIds((current) =>
      checked
        ? [
            ...new Set([
              ...current,
              ...filteredMembers.map((member) => member.id),
            ]),
          ]
        : current.filter(
            (id) => !filteredMembers.some((member) => member.id === id),
          ),
    );
  };

  return (
    <>
      <section className='flex w-full flex-col bg-bg-white-0'>
        <header className='flex min-h-20 items-center gap-3 px-5 py-4'>
          <div className='min-w-0 flex-1'>
            <h2 className='text-label-lg text-text-strong-950'>Members</h2>
            <p className='mt-1 text-paragraph-sm text-text-sub-600'>
              Manage team members and roles.
            </p>
          </div>
          <Button.Root
            variant='primary'
            size='xsmall'
            className='shrink-0'
            onClick={() => setInviteOpen(true)}
          >
            <Button.Icon as={RiUserAddLine} />
            Invite Members
          </Button.Root>
        </header>

        <div className='flex min-h-0 flex-1 flex-col gap-4 p-5'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <Input.Root size='xsmall' className='w-full sm:max-w-[300px]'>
              <Input.Wrapper>
                <Input.Icon as={RiSearchLine} />
                <Input.Input
                  aria-label='Search members'
                  placeholder='Search...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
            members={filteredMembers}
            selectedMemberIds={selectedMemberIds}
            allSelected={allSelected}
            onToggleAll={toggleAllMembers}
            onToggleMember={toggleMember}
            onChangeRole={requestRoleChange}
            onRequestRemoval={setPendingRemoval}
            onResend={resendInvite}
          />
        </div>
      </section>

      <DestructiveConfirmModal
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
        title={
          pendingRemoval?.status === 'pending'
            ? 'Cancel this invitation?'
            : `Remove ${pendingRemoval?.name ?? 'member'}?`
        }
        description={
          pendingRemoval?.status === 'pending'
            ? `${pendingRemoval?.email} will no longer be able to join with this invite.`
            : `${pendingRemoval?.name} will lose access to this organization immediately.`
        }
        confirmLabel={
          pendingRemoval?.status === 'pending' ? 'Cancel invite' : 'Remove'
        }
        cancelLabel='Keep'
        onConfirm={confirmRemoval}
      />

      <RoleChangeConfirmModal
        pending={pendingRoleChange}
        onOpenChange={(open) => !open && setPendingRoleChange(null)}
        onConfirm={confirmRoleChange}
      />

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        currentMemberEmails={members.map((m) => m.email.toLowerCase())}
        seatsRemaining={seatsRemaining}
        onSend={handleSend}
      />
    </>
  );
}

function MembersTable({
  members,
  selectedMemberIds,
  allSelected,
  onToggleAll,
  onToggleMember,
  onChangeRole,
  onRequestRemoval,
  onResend,
}: {
  members: Member[];
  selectedMemberIds: string[];
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  onToggleMember: (memberId: string, checked: boolean) => void;
  onChangeRole: (id: string, role: MemberRole) => void;
  onRequestRemoval: (member: Member) => void;
  onResend: (member: Member) => void;
}) {
  if (members.length === 0) {
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
              <TableColumnLabel>Email Address</TableColumnLabel>
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
        {members.map((member, index) => (
          <React.Fragment key={member.id}>
            {index > 0 && <Table.RowDivider />}
            <Table.Row>
              <Table.Cell className='h-12 py-3'>
                <div className='flex min-w-0 items-center gap-3'>
                  <Checkbox.Root
                    checked={selectedMemberIds.includes(member.id)}
                    aria-label={`Select ${member.name}`}
                    onCheckedChange={(checked) =>
                      onToggleMember(member.id, checked === true)
                    }
                  />
                  <MemberAvatar member={member} />
                  <span className='truncate text-label-sm text-text-strong-950'>
                    {member.name}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell className='h-12 py-3'>
                <span className='block truncate text-paragraph-sm text-text-sub-600'>
                  {member.email}
                </span>
              </Table.Cell>
              <Table.Cell className='h-12 py-3'>
                <MemberRoleBadge member={member} />
              </Table.Cell>
              <Table.Cell className='h-12 px-3 py-3 text-center'>
                <MemberActions
                  member={member}
                  onChangeRole={onChangeRole}
                  onRequestRemoval={onRequestRemoval}
                  onResend={onResend}
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

function MemberRoleBadge({ member }: { member: Member }) {
  const label =
    member.status === 'pending'
      ? 'Pending Invitation'
      : MEMBER_ROLE_LABEL[member.role];
  const status =
    member.status === 'pending'
      ? 'pending'
      : member.role === 'admin'
        ? 'completed'
        : 'disabled';

  return (
    <StatusBadge.Root variant='stroke' status={status}>
      <StatusBadge.Dot />
      {label}
    </StatusBadge.Root>
  );
}

function MemberAvatar({ member }: { member: Member }) {
  const src = MEMBER_AVATAR_IMAGES[member.id];

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
    <Avatar.Root size='24' color={member.color}>
      {member.initials}
    </Avatar.Root>
  );
}

function MemberActions({
  member,
  onChangeRole,
  onRequestRemoval,
  onResend,
}: {
  member: Member;
  onChangeRole: (id: string, role: MemberRole) => void;
  onRequestRemoval: (member: Member) => void;
  onResend: (member: Member) => void;
}) {
  const isPending = member.status === 'pending';

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <CompactButton.Root
          variant='ghost'
          size='large'
          aria-label={`Actions for ${member.name}`}
        >
          <CompactButton.Icon as={RiMore2Line} />
        </CompactButton.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align='end' className='w-[220px]'>
        {isPending ? (
          <>
            <Dropdown.Item onSelect={() => onResend(member)}>
              Resend invite
            </Dropdown.Item>
            <Dropdown.Item
              className='text-error-base data-[highlighted]:text-error-base'
              onSelect={() => onRequestRemoval(member)}
            >
              Cancel invite
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.MenuSub>
              <Dropdown.MenuSubTrigger>Change role</Dropdown.MenuSubTrigger>
              <Dropdown.MenuSubContent className='w-[160px]'>
                <Dropdown.RadioGroup
                  value={member.role}
                  onValueChange={(value) =>
                    onChangeRole(member.id, value as MemberRole)
                  }
                >
                  <Dropdown.RadioItem
                    value='admin'
                    className='cursor-pointer rounded-lg p-2 text-paragraph-sm outline-none data-[highlighted]:bg-bg-weak-50'
                  >
                    Admin
                  </Dropdown.RadioItem>
                  <Dropdown.RadioItem
                    value='member'
                    className='cursor-pointer rounded-lg p-2 text-paragraph-sm outline-none data-[highlighted]:bg-bg-weak-50'
                  >
                    Member
                  </Dropdown.RadioItem>
                </Dropdown.RadioGroup>
              </Dropdown.MenuSubContent>
            </Dropdown.MenuSub>
            <Dropdown.Item
              className='text-error-base data-[highlighted]:text-error-base'
              onSelect={() => onRequestRemoval(member)}
            >
              Remove from organization
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Role change confirm — neutral (not destructive), names the outcome */
/* ------------------------------------------------------------------ */

function RoleChangeConfirmModal({
  pending,
  onOpenChange,
  onConfirm,
}: {
  pending: { member: Member; role: MemberRole } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const isEscalation = pending?.role === 'admin';

  return (
    <Modal.Root open={pending !== null} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[440px]'>
        <Modal.Header
          title={
            isEscalation
              ? `Make ${pending?.member.name} an Admin?`
              : `Change ${pending?.member.name} to Member?`
          }
          description={
            isEscalation
              ? 'Admins can manage members, billing, integrations, and organization settings.'
              : "They'll lose access to members, billing, and settings."
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
            {isEscalation ? 'Make Admin' : 'Change to Member'}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Multi-invite modal                                                  */
/* ------------------------------------------------------------------ */

const ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
];

function domainMismatch(email: string) {
  const at = email.lastIndexOf('@');
  if (at === -1) return false;
  return email.slice(at + 1).toLowerCase() !== ORG_DOMAIN;
}

function splitEmails(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function InviteModal({
  open,
  onOpenChange,
  currentMemberEmails,
  seatsRemaining,
  onSend,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMemberEmails: string[];
  seatsRemaining: number;
  onSend: (invitees: Invitee[]) => void;
}) {
  const [draft, setDraft] = React.useState('');
  const [draftNote, setDraftNote] = React.useState<string | null>(null);
  const [invitees, setInvitees] = React.useState<Invitee[]>([]);
  const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
  const nextId = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setDraft('');
    setDraftNote(null);
    setInvitees([]);
  };

  const commitEmails = (raw: string) => {
    const candidates = splitEmails(raw);
    if (candidates.length === 0) return;

    const seen = new Set(invitees.map((i) => i.email.toLowerCase()));
    const added: Invitee[] = [];
    const skipped: string[] = [];

    for (const email of candidates) {
      const lower = email.toLowerCase();
      if (!EMAIL_REGEX.test(email)) {
        skipped.push(`${email} (invalid email)`);
        continue;
      }
      if (currentMemberEmails.includes(lower)) {
        skipped.push(`${email} (already a member)`);
        continue;
      }
      if (seen.has(lower)) {
        skipped.push(`${email} (duplicate)`);
        continue;
      }
      seen.add(lower);
      added.push({ id: nextId.current++, email, role: 'member' });
    }

    setInvitees((prev) => [...prev, ...added]);
    setDraft('');
    setDraftNote(skipped.length ? `Skipped ${skipped.join(', ')}` : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      commitEmails(draft);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (splitEmails(text).length > 1) {
      e.preventDefault();
      commitEmails(text);
    }
  };

  const removeInvitee = (id: number) => {
    setInvitees((prev) => prev.filter((i) => i.id !== id));
  };

  const setRole = (id: number, role: MemberRole) => {
    setInvitees((prev) => prev.map((i) => (i.id === id ? { ...i, role } : i)));
  };

  const requestClose = () => {
    if (invitees.length > 0 || draft.trim().length > 0) {
      setCloseConfirmOpen(true);
      return;
    }
    onOpenChange(false);
    reset();
  };

  const send = () => {
    onSend(invitees);
    reset();
  };

  const canSend = invitees.length > 0;
  const draftMismatch = draft.trim().length > 0 && domainMismatch(draft.trim());
  const overSeatLimit = invitees.length > seatsRemaining;

  return (
    <>
      <Modal.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            requestClose();
            return;
          }
          onOpenChange(next);
        }}
      >
        <Modal.Content className='max-w-[480px]'>
          <Modal.Header
            title='Invite members'
            description='Add email addresses and pick a role for each person.'
          />
          <Modal.Body className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    ref={inputRef}
                    placeholder='name@company.com'
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      setDraftNote(null);
                    }}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                  />
                </Input.Wrapper>
              </Input.Root>
              {draftNote && (
                <span className='flex items-start gap-1 text-paragraph-xs text-warning-base'>
                  <RiAlertLine className='mt-px size-3.5 shrink-0' />
                  {draftNote}
                </span>
              )}
              {!draftNote && draftMismatch && (
                <span className='flex items-start gap-1 text-paragraph-xs text-warning-base'>
                  <RiAlertLine className='mt-px size-3.5 shrink-0' />
                  This address doesn&apos;t match {ORG_DOMAIN} — double check
                  before sending.
                </span>
              )}
            </div>

            {invitees.length > 0 && (
              <ul className='flex flex-col gap-2'>
                {invitees.map((invitee) => (
                  <li key={invitee.id} className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <span className='min-w-0 flex-1 truncate text-paragraph-sm text-text-strong-950'>
                        {invitee.email}
                      </span>
                      <Select.Root
                        size='xsmall'
                        variant='compact'
                        value={invitee.role}
                        onValueChange={(v) =>
                          setRole(invitee.id, v as MemberRole)
                        }
                      >
                        <Select.Trigger className='w-[110px]'>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {ROLE_OPTIONS.map((option) => (
                            <Select.Item
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </Select.Item>
                          ))}
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
                    </div>
                    {domainMismatch(invitee.email) && (
                      <span className='flex items-start gap-1 pl-0.5 text-paragraph-xs text-warning-base'>
                        <RiAlertLine className='mt-px size-3.5 shrink-0' />
                        This address doesn&apos;t match {ORG_DOMAIN}.
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <LinkButton
              onClick={() => {
                commitEmails(draft);
                inputRef.current?.focus();
              }}
              className='flex w-fit items-center gap-1 text-label-sm'
            >
              <RiAddLine className='size-4' />
              Add another person
            </LinkButton>

            <p className='text-paragraph-xs text-text-sub-600'>
              They&apos;ll get an email invite to join {ORG_NAME}. Invite links
              expire after 7 days.
            </p>

            <p
              className={cn(
                'text-paragraph-xs',
                overSeatLimit ? 'text-warning-base' : 'text-text-sub-600',
              )}
            >
              {overSeatLimit
                ? `Only ${seatsRemaining} seat${seatsRemaining === 1 ? '' : 's'} remaining on your plan — remove ${invitees.length - seatsRemaining} invitee${invitees.length - seatsRemaining === 1 ? '' : 's'} or upgrade before sending.`
                : `${seatsRemaining} seat${seatsRemaining === 1 ? '' : 's'} remaining on your plan.`}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              className='w-full'
              onClick={requestClose}
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='primary'
              size='small'
              className='w-full'
              disabled={!canSend || overSeatLimit}
              onClick={send}
            >
              Send invite
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      <DestructiveConfirmModal
        open={closeConfirmOpen}
        onOpenChange={setCloseConfirmOpen}
        title='Discard these invites?'
        description="You haven't sent the invitations you added. Closing now will discard them."
        confirmLabel='Discard'
        cancelLabel='Keep editing'
        onConfirm={() => {
          setCloseConfirmOpen(false);
          onOpenChange(false);
          reset();
        }}
      />
    </>
  );
}
