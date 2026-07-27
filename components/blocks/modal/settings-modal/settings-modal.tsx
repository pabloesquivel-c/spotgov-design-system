'use client';

import * as React from 'react';
import { RiAddLine, RiCloseLine, RiUserAddLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as Modal from '@/components/ui/modal';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';

import {
  PERSONAL_SECTIONS,
  SettingsModalRail,
  type SettingsModalSectionId,
} from './settings-modal-rail';
import { NotificationsModalSection } from './sections/notifications';
import { PreferencesModalSection } from './sections/preferences';
import { ProfileModalSection } from './sections/profile';
import { GeneralModalSection } from './sections/general';
import { MembersModalSection } from './sections/members';
import { BusinessProfileModalSection } from './sections/business-profile';
import { IntegrationsModalSection } from './sections/integrations';
import { AnalysisTemplatesModalSection } from './sections/analysis-templates';
import { BillingModalSection } from './sections/billing';

/** Imperative save/discard contract a savable section exposes to the shell footer (R11). */
export type SectionCommitHandle = {
  save: () => void;
  discard: () => void;
};

const SECTION_COPY: Record<
  SettingsModalSectionId,
  { title: string; description: string }
> = {
  profile: {
    title: 'Account',
    description: 'Manage your name, photo, and sign-in details.',
  },
  preferences: {
    title: 'Preferences',
    description: 'Set language, currency, and appearance.',
  },
  notifications: {
    title: 'Notifications',
    description: 'Choose the updates you receive.',
  },
  general: {
    title: 'Company',
    description: 'Manage organization name, logo, and defaults.',
  },
  members: {
    title: 'Members',
    description: 'Manage team access and roles.',
  },
  'business-profile': {
    title: 'Business profile',
    description:
      'Manage company details, certifications, and licenses used in bids.',
  },
  integrations: {
    title: 'Integrations',
    description: 'Connect SpotGov to tender platforms.',
  },
  'analysis-templates': {
    title: 'Analysis templates',
    description: 'Set the questions SpotGov uses for tender analysis.',
  },
  billing: {
    title: 'Billing',
    description: 'Review your plan, seats, and invoices.',
  },
};

// Four sections use an explicit Discard/Save changes commit in the header.
const SAVABLE_SECTIONS: ReadonlySet<SettingsModalSectionId> = new Set([
  'profile',
  'preferences',
  'notifications',
  'general',
]);

export type SettingsModalProps = {
  defaultSection?: SettingsModalSectionId;
  defaultOpen?: boolean;
  isAdmin?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  triggerLabel?: string;
};

/**
 * Standalone settings modal, mechanically ported from AlignUI Figma
 * reference frames with content substituted per the Settings IA brief.
 * Not wired to any route, store, or auth — each section owns its own
 * local state; `SectionCommitHandle` is the seam a real adapter would
 * hang off (see contract/types.ts).
 */
export function SettingsModal({
  defaultSection = PERSONAL_SECTIONS[0].id,
  defaultOpen = true,
  isAdmin = false,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  triggerLabel = 'Open settings',
}: SettingsModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const [activeSection, setActiveSection] =
    React.useState<SettingsModalSectionId>(() =>
      isAdmin ||
      PERSONAL_SECTIONS.some((section) => section.id === defaultSection)
        ? defaultSection
        : PERSONAL_SECTIONS[0].id,
    );

  const activeRef = React.useRef<SectionCommitHandle | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [membersInviteAction, setMembersInviteAction] = React.useState<
    (() => void) | null
  >(null);
  const [analysisTemplatesAction, setAnalysisTemplatesAction] = React.useState<
    (() => void) | null
  >(null);

  const [pendingSection, setPendingSection] =
    React.useState<SettingsModalSectionId | null>(null);
  const [pendingClose, setPendingClose] = React.useState(false);

  const savable = SAVABLE_SECTIONS.has(activeSection);
  const { title, description } = SECTION_COPY[activeSection];

  const setModalOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const setMembersHeaderAction = React.useCallback(
    (action: (() => void) | null) => setMembersInviteAction(() => action),
    [],
  );
  const setAnalysisTemplatesHeaderAction = React.useCallback(
    (action: (() => void) | null) => setAnalysisTemplatesAction(() => action),
    [],
  );

  const content: Record<SettingsModalSectionId, React.ReactNode> = {
    profile: <ProfileModalSection ref={activeRef} onDirtyChange={setDirty} />,
    preferences: (
      <PreferencesModalSection ref={activeRef} onDirtyChange={setDirty} />
    ),
    notifications: (
      <NotificationsModalSection ref={activeRef} onDirtyChange={setDirty} />
    ),
    general: <GeneralModalSection ref={activeRef} onDirtyChange={setDirty} />,
    members: (
      <MembersModalSection onInviteActionChange={setMembersHeaderAction} />
    ),
    'business-profile': <BusinessProfileModalSection />,
    integrations: <IntegrationsModalSection />,
    'analysis-templates': (
      <AnalysisTemplatesModalSection
        onNewTemplateActionChange={setAnalysisTemplatesHeaderAction}
      />
    ),
    billing: <BillingModalSection />,
  };

  const requestSectionChange = (id: SettingsModalSectionId) => {
    if (id === activeSection) return;
    if (dirty) {
      setPendingSection(id);
      return;
    }
    setActiveSection(id);
  };

  const requestClose = () => {
    if (dirty) {
      setPendingClose(true);
      return;
    }
    setModalOpen(false);
  };

  const cancelPendingNav = () => {
    setPendingSection(null);
    setPendingClose(false);
  };

  const confirmDiscardAndProceed = () => {
    activeRef.current?.discard();
    setDirty(false);
    if (pendingClose) setModalOpen(false);
    if (pendingSection) setActiveSection(pendingSection);
    setPendingSection(null);
    setPendingClose(false);
  };

  const handleDiscard = () => {
    activeRef.current?.discard();
    setDirty(false);
  };

  const handleSave = () => {
    activeRef.current?.save();
    setDirty(false);
    notification({ status: 'success', title: 'Changes saved' });
  };

  return (
    <Modal.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setModalOpen(true);
          return;
        }
        requestClose();
      }}
    >
      {showTrigger ? (
        <Modal.Trigger asChild>
          <Button.Root variant='neutral' mode='stroke'>
            {triggerLabel}
          </Button.Root>
        </Modal.Trigger>
      ) : null}
      <Modal.Content
        className='flex h-[min(680px,calc(100dvh-64px))] w-full max-w-[960px] overflow-hidden rounded-20 p-0'
        showClose={false}
        onEscapeKeyDown={(event) => {
          if (dirty) {
            event.preventDefault();
            requestClose();
          }
        }}
        onPointerDownOutside={(event) => {
          if (dirty) {
            event.preventDefault();
            requestClose();
          }
        }}
      >
        <SettingsModalRail
          activeSection={activeSection}
          onSectionChange={requestSectionChange}
          isAdmin={isAdmin}
        />

        <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
          <div className='flex min-h-[80px] shrink-0 items-center gap-3.5 px-5 py-4'>
            <div className='min-w-0 flex-1'>
              <Modal.Title className='text-label-md text-text-strong-950'>
                {title}
              </Modal.Title>
              <Modal.Description className='mt-1 text-paragraph-sm text-text-sub-600'>
                {description}
              </Modal.Description>
            </div>
            {savable ? (
              <div className='ml-auto flex shrink-0 items-center gap-3'>
                <Button.Root
                  variant='neutral'
                  mode='stroke'
                  size='xsmall'
                  onClick={handleDiscard}
                  disabled={!dirty}
                >
                  Discard
                </Button.Root>
                <Button.Root
                  variant='primary'
                  size='xsmall'
                  onClick={handleSave}
                  disabled={!dirty}
                >
                  Save changes
                </Button.Root>
              </div>
            ) : activeSection === 'billing' ? null : activeSection ===
                'members' && membersInviteAction ? (
              <Button.Root
                variant='primary'
                size='xsmall'
                className='shrink-0'
                onClick={membersInviteAction}
              >
                <Button.Icon as={RiUserAddLine} />
                Invite members
              </Button.Root>
            ) : activeSection === 'analysis-templates' &&
              analysisTemplatesAction ? (
              <Button.Root
                variant='primary'
                size='xsmall'
                className='shrink-0'
                onClick={analysisTemplatesAction}
              >
                <Button.Icon as={RiAddLine} />
                New template
              </Button.Root>
            ) : null}
            <CompactButton.Root
              type='button'
              variant='ghost'
              size='large'
              aria-label='Close settings'
              onClick={requestClose}
            >
              <CompactButton.Icon as={RiCloseLine} />
            </CompactButton.Root>
          </div>

          <Divider.Root />

          <div className='min-h-0 flex-1 overflow-y-auto p-5'>
            {content[activeSection]}
          </div>
        </div>
      </Modal.Content>

      <DestructiveConfirmModal
        open={pendingSection !== null || pendingClose}
        onOpenChange={(nextOpen) => !nextOpen && cancelPendingNav()}
        title='Discard unsaved changes?'
        description='You have unsaved changes in this section. Leaving now will discard them.'
        confirmLabel='Discard changes'
        cancelLabel='Keep editing'
        onConfirm={confirmDiscardAndProceed}
      />
    </Modal.Root>
  );
}
