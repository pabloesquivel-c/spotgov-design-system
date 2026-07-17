'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiAlertLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiMore2Line,
  RiTeamLine,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Input from '@/components/ui/input';
import * as Modal from '@/components/ui/modal';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Switch from '@/components/ui/switch';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';
import { cn } from '@/utils/cn';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';
import {
  DEFAULT_MEMBERS,
  LARGE_MEMBERS,
  MEMBER_ROLE_LABEL,
  type AvatarColor,
  type Member,
  type MemberRole,
} from './mock-data';

const PAGE_SIZE = 6;
const ORG_DOMAIN = 'acmecorp.com';
const ORG_NAME = 'Acme Corporation';

type Invitee = { id: number; email: string; role: MemberRole };

export function MembersSection() {
  const [largeTeam, setLargeTeam] = React.useState(false);
  const [members, setMembers] = React.useState<Member[]>(DEFAULT_MEMBERS);
  const [page, setPage] = React.useState(1);

  // confirm-remove / confirm-cancel state
  const [pendingRemoval, setPendingRemoval] = React.useState<Member | null>(null);

  // invite modal state
  const [inviteOpen, setInviteOpen] = React.useState(false);

  const handleToggleLargeTeam = (on: boolean) => {
    setLargeTeam(on);
    setMembers(on ? LARGE_MEMBERS : DEFAULT_MEMBERS);
    setPage(1);
  };

  const owner = members.find((m) => m.role === 'owner');
  const admins = members.filter((m) => m.role === 'admin');
  const activeMembers = members.filter(
    (m) => m.role === 'member' && m.status === 'active',
  );
  const pending = members.filter((m) => m.status === 'pending');

  const totalPages = Math.max(1, Math.ceil(activeMembers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = activeMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const changeRole = (id: string, role: MemberRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  };

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

  return (
    <>
      <SettingsCard
        icon={RiTeamLine}
        title='Members'
        description={`${members.length} people have access to this organization.`}
        headerAction={
          <Button.Root
            variant='primary'
            size='small'
            onClick={() => setInviteOpen(true)}
          >
            <Button.Icon as={RiAddLine} />
            Invite
          </Button.Root>
        }
      >
        <div className='flex flex-col gap-5'>
          {/* Simulate-larger-team demo control */}
          <div className='flex flex-col gap-1.5 rounded-xl bg-bg-weak-50 p-3'>
            <label className='flex items-center justify-between gap-4'>
              <span className='text-label-sm text-text-strong-950'>
                Simulate larger team
              </span>
              <Switch.Root
                checked={largeTeam}
                onCheckedChange={handleToggleLargeTeam}
              />
            </label>
            <DemoNote>
              Swaps the {DEFAULT_MEMBERS.length}-person roster for a{' '}
              {LARGE_MEMBERS.length}-person one so pagination pages through
              different people. This toggle is a demo affordance, not part of the
              shipped design.
            </DemoNote>
          </div>

          {owner && (
            <RoleGroup label='Owner'>
              <MemberRow
                member={owner}
                onChangeRole={changeRole}
                onRequestRemoval={setPendingRemoval}
                onResend={() => {}}
              />
            </RoleGroup>
          )}

          {admins.length > 0 && (
            <RoleGroup label='Admins'>
              {admins.map((member, index) => (
                <React.Fragment key={member.id}>
                  {index > 0 && (
                    <div className='h-px shrink-0 bg-stroke-soft-200' />
                  )}
                  <MemberRow
                    member={member}
                    onChangeRole={changeRole}
                    onRequestRemoval={setPendingRemoval}
                    onResend={() => {}}
                  />
                </React.Fragment>
              ))}
            </RoleGroup>
          )}

          {activeMembers.length > 0 && (
            <RoleGroup label='Members'>
              {pageItems.map((member, index) => (
                <React.Fragment key={member.id}>
                  {index > 0 && (
                    <div className='h-px shrink-0 bg-stroke-soft-200' />
                  )}
                  <MemberRow
                    member={member}
                    onChangeRole={changeRole}
                    onRequestRemoval={setPendingRemoval}
                    onResend={() => {}}
                  />
                </React.Fragment>
              ))}
            </RoleGroup>
          )}

          {pending.length > 0 && (
            <RoleGroup label='Pending Invitations' dashed>
              {pending.map((member, index) => (
                <React.Fragment key={member.id}>
                  {index > 0 && (
                    <div className='h-px shrink-0 bg-stroke-soft-200' />
                  )}
                  <MemberRow
                    member={member}
                    onChangeRole={changeRole}
                    onRequestRemoval={setPendingRemoval}
                    onResend={() =>
                      notification({
                        status: 'success',
                        title: `Invitation resent to ${member.email}`,
                      })
                    }
                  />
                </React.Fragment>
              ))}
            </RoleGroup>
          )}

          {/* Pagination — only the Members group grows unbounded */}
          {activeMembers.length > PAGE_SIZE && (
            <div className='flex flex-col items-center gap-2 border-t border-stroke-soft-200 pt-3.5'>
              <Pagination.Root variant='basic'>
                <Pagination.NavButton
                  aria-label='Previous page'
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.NavIcon as={RiArrowLeftSLine} />
                </Pagination.NavButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Pagination.Item
                    key={p}
                    current={p === currentPage}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Item>
                ))}
                <Pagination.NavButton
                  aria-label='Next page'
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <Pagination.NavIcon as={RiArrowRightSLine} />
                </Pagination.NavButton>
              </Pagination.Root>
            </div>
          )}
          {!largeTeam && (
            <DemoNote className='justify-center text-center'>
              Only {DEFAULT_MEMBERS.length} members exist at this size, so
              there&apos;s a single page. Turn on &ldquo;Simulate larger
              team&rdquo; to page through more.
            </DemoNote>
          )}
        </div>
      </SettingsCard>

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

      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Role group — bordered card wrapping one role's rows                */
/* ------------------------------------------------------------------ */

function RoleGroup({
  label,
  dashed,
  children,
}: {
  label: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-[12px] font-medium uppercase tracking-[0.04em] text-text-sub-600'>
        {label}
      </span>
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-xl border',
          dashed
            ? 'border-dashed border-stroke-sub-300 bg-bg-weak-50'
            : 'border-solid border-stroke-soft-200',
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Member row                                                          */
/* ------------------------------------------------------------------ */

function roleBadgeColor(role: MemberRole) {
  if (role === 'owner') return 'purple' as const;
  if (role === 'admin') return 'blue' as const;
  return 'gray' as const;
}

function MemberRow({
  member,
  onChangeRole,
  onRequestRemoval,
  onResend,
}: {
  member: Member;
  onChangeRole: (id: string, role: MemberRole) => void;
  onRequestRemoval: (member: Member) => void;
  onResend: () => void;
}) {
  const isPending = member.status === 'pending';
  const isOwner = member.role === 'owner';

  return (
    <div className='flex items-center gap-3 px-3.5 py-3'>
      <Avatar.Root size='32' color={member.color as AvatarColor}>
        {member.initials}
      </Avatar.Root>

      <div className='flex min-w-0 flex-1 flex-col'>
        <span className='truncate text-label-sm text-text-strong-950'>
          {member.name}
        </span>
        {!isPending && (
          <span className='truncate text-paragraph-xs text-text-sub-600'>
            {member.email}
          </span>
        )}
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        {isPending ? (
          <Badge.Root variant='light' color='orange' size='medium'>
            Pending
          </Badge.Root>
        ) : (
          <Badge.Root
            variant='light'
            color={roleBadgeColor(member.role)}
            size='medium'
          >
            {MEMBER_ROLE_LABEL[member.role]}
          </Badge.Root>
        )}

        {/* Owner has no row actions */}
        {isOwner ? (
          <div className='size-7' aria-hidden='true' />
        ) : (
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <CompactButton.Root variant='ghost' size='large'>
                <CompactButton.Icon as={RiMore2Line} />
              </CompactButton.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align='end' className='w-[220px]'>
              {isPending ? (
                <>
                  <Dropdown.Item onSelect={onResend}>
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
                    <Dropdown.MenuSubTrigger>
                      Change role
                    </Dropdown.MenuSubTrigger>
                    <Dropdown.MenuSubContent className='w-[160px]'>
                      <Dropdown.RadioGroup
                        value={member.role}
                        onValueChange={(v) =>
                          onChangeRole(member.id, v as MemberRole)
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
        )}
      </div>
    </div>
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

function InviteModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [draft, setDraft] = React.useState('');
  const [invitees, setInvitees] = React.useState<Invitee[]>([]);
  const nextId = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setDraft('');
    setInvitees([]);
  };

  const commitDraft = () => {
    const email = draft.trim();
    if (!email) return;
    setInvitees((prev) => [
      ...prev,
      { id: nextId.current++, email, role: 'member' },
    ]);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft();
    }
  };

  const removeInvitee = (id: number) => {
    setInvitees((prev) => prev.filter((i) => i.id !== id));
  };

  const setRole = (id: number, role: MemberRole) => {
    setInvitees((prev) => prev.map((i) => (i.id === id ? { ...i, role } : i)));
  };

  const send = () => {
    const count = invitees.length + (draft.trim() ? 1 : 0);
    onOpenChange(false);
    reset();
    notification({
      status: 'success',
      title:
        count === 1 ? 'Invitation sent' : `${count} invitations sent`,
    });
  };

  const canSend = invitees.length > 0 || draft.trim().length > 0;
  const draftMismatch = draft.trim().length > 0 && domainMismatch(draft.trim());

  return (
    <Modal.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
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
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Input.Wrapper>
            </Input.Root>
            {draftMismatch && (
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
                      onValueChange={(v) => setRole(invitee.id, v as MemberRole)}
                    >
                      <Select.Trigger className='w-[110px]'>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {ROLE_OPTIONS.map((option) => (
                          <Select.Item key={option.value} value={option.value}>
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

          <button
            type='button'
            onClick={() => {
              commitDraft();
              inputRef.current?.focus();
            }}
            className='flex w-fit items-center gap-1 text-label-sm text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline'
          >
            <RiAddLine className='size-4' />
            Add another person
          </button>

          <p className='text-paragraph-xs text-text-soft-400'>
            They&apos;ll get an email invite to join {ORG_NAME}. Invite links
            expire after 7 days.
          </p>
        </Modal.Body>
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
            disabled={!canSend}
            onClick={send}
          >
            Send invite
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
