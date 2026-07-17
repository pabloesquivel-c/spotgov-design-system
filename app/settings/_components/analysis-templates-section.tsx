'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiCheckboxCircleFill,
  RiDraggable,
  RiFileTextLine,
  RiInformationLine,
  RiMore2Line,
  RiSparkling2Line,
} from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Switch from '@/components/ui/switch';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';
import { cn } from '@/utils/cn';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';
import { DEFAULT_TEMPLATES, type AnalysisTemplate } from './mock-data';

export function AnalysisTemplatesSection() {
  const [templates, setTemplates] =
    React.useState<AnalysisTemplate[]>(DEFAULT_TEMPLATES);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const [modalTemplate, setModalTemplate] = React.useState<
    AnalysisTemplate | 'new' | null
  >(null);
  const [resetOpen, setResetOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] =
    React.useState<AnalysisTemplate | null>(null);

  const toggleActive = (id: string) =>
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    );

  const moveTemplate = (from: number, to: number) => {
    if (to < 0 || to >= templates.length || from === to) return;
    setTemplates((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleDrop = (target: number) => {
    setOverIndex(null);
    if (dragIndex !== null) moveTemplate(dragIndex, target);
    setDragIndex(null);
  };

  const isDuplicateName = (name: string, excludeId?: string) =>
    templates.some(
      (t) =>
        t.id !== excludeId &&
        t.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

  const handleCreate = (draft: Omit<AnalysisTemplate, 'id' | 'active'>) => {
    setTemplates((prev) => [
      ...prev,
      { ...draft, id: `custom-${prev.length}-${draft.name}`, active: true },
    ]);
    setModalTemplate(null);
    notification({ status: 'success', title: `${draft.name} created` });
  };

  const handleSaveEdit = (
    id: string,
    draft: Omit<AnalysisTemplate, 'id' | 'active'>,
  ) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...draft } : t)),
    );
    setModalTemplate(null);
    notification({ status: 'success', title: `${draft.name} updated` });
  };

  const anyActive = templates.some((t) => t.active);

  return (
    <>
      <SettingsCard
        icon={RiFileTextLine}
        title='Analysis Templates'
        description="These categories control what SpotGov's AI looks for in every tender analysis across your organization."
        headerAction={
          <div className='flex items-center gap-2'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={() => setResetOpen(true)}
            >
              Reset to Defaults
            </Button.Root>
            <Button.Root
              variant='primary'
              size='small'
              onClick={() => setModalTemplate('new')}
            >
              <Button.Icon as={RiAddLine} />
              New Template
            </Button.Root>
          </div>
        }
      >
        <ul className='flex flex-col gap-2'>
          {templates.map((template, index) => (
            <li
              key={template.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(index);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDrop={() => handleDrop(index)}
              className={cn(
                'flex items-center gap-3 rounded-xl p-3 ring-1 ring-inset ring-stroke-soft-200 transition-colors',
                dragIndex === index && 'opacity-50',
                overIndex === index &&
                  dragIndex !== index &&
                  'ring-2 ring-primary-base',
              )}
            >
              <button
                type='button'
                aria-label={`Reorder ${template.name}. Use arrow up or down to move.`}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    moveTemplate(index, index - 1);
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    moveTemplate(index, index + 1);
                  }
                }}
                className='shrink-0 cursor-grab rounded-md text-text-soft-400 outline-none transition-colors hover:text-text-sub-600 focus-visible:ring-2 focus-visible:ring-primary-base active:cursor-grabbing'
              >
                <RiDraggable className='size-5' />
              </button>

              <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                <span className='truncate text-label-sm text-text-strong-950'>
                  {template.name}
                </span>
                <span className='line-clamp-1 text-paragraph-xs text-text-sub-600'>
                  {template.question}
                </span>
              </div>

              <label className='flex shrink-0 items-center gap-2'>
                <span className='sr-only'>
                  Toggle {template.name} active
                </span>
                <Switch.Root
                  checked={template.active}
                  onCheckedChange={() => toggleActive(template.id)}
                />
              </label>

              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <CompactButton.Root variant='ghost' size='large'>
                    <CompactButton.Icon as={RiMore2Line} />
                  </CompactButton.Root>
                </Dropdown.Trigger>
                <Dropdown.Content align='end' className='w-[180px]'>
                  <Dropdown.Item onSelect={() => setModalTemplate(template)}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={index === 0}
                    onSelect={() => moveTemplate(index, index - 1)}
                  >
                    <Dropdown.ItemIcon as={RiArrowUpLine} />
                    Move up
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={index === templates.length - 1}
                    onSelect={() => moveTemplate(index, index + 1)}
                  >
                    <Dropdown.ItemIcon as={RiArrowDownLine} />
                    Move down
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='text-error-base data-[highlighted]:text-error-base'
                    onSelect={() => setDeleteTarget(template)}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            </li>
          ))}
        </ul>

        {!anyActive && (
          <Alert.Root
            variant='lighter'
            status='warning'
            size='xsmall'
            className='mt-3'
          >
            <Alert.Icon as={RiInformationLine} />
            Every category is off — new analyses will run with no categories
            applied.
          </Alert.Root>
        )}

        <Alert.Root
          variant='lighter'
          status='information'
          size='xsmall'
          className='mt-3'
        >
          <Alert.Icon as={RiInformationLine} />
          Reordering or turning a category off updates every tender&apos;s
          analysis org-wide, including tenders already analyzed.
        </Alert.Root>

        <DemoNote className='mt-3'>
          Drag the handle (or focus it and press Arrow Up/Down) to reorder
          templates. Reordering is stored in local state only for this
          preview.
        </DemoNote>
      </SettingsCard>

      <TemplateModal
        key={
          modalTemplate === null
            ? 'closed'
            : modalTemplate === 'new'
              ? 'new'
              : `edit-${modalTemplate.id}`
        }
        open={modalTemplate !== null}
        initial={modalTemplate === 'new' ? null : modalTemplate}
        onOpenChange={(open) => !open && setModalTemplate(null)}
        onCreate={handleCreate}
        onSaveEdit={handleSaveEdit}
        isDuplicateName={isDuplicateName}
      />

      <DestructiveConfirmModal
        open={resetOpen}
        onOpenChange={setResetOpen}
        title='Reset templates to defaults?'
        description='Any templates you added or reordered will be replaced by the original set.'
        confirmLabel='Reset'
        onConfirm={() => {
          setTemplates(DEFAULT_TEMPLATES);
          setResetOpen(false);
          notification({
            status: 'information',
            title: 'Templates reset to defaults',
          });
        }}
      />

      <DestructiveConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name ?? ''}"?`}
        description={`${deleteTarget?.name ?? 'This template'} will no longer be applied to any tender analysis across your organization. This can't be undone.`}
        confirmLabel='Delete template'
        onConfirm={() => {
          if (!deleteTarget) return;
          setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
          notification({
            status: 'information',
            title: `${deleteTarget.name} deleted`,
          });
          setDeleteTarget(null);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Create/Edit template modal (single screen + AI refine)              */
/* ------------------------------------------------------------------ */

function refineQuestion(question: string) {
  const trimmed = question.trim().replace(/\.+$/, '');
  return `${trimmed}. Cite the specific tender clause or section that supports each finding, and flag anything ambiguous for manual review.`;
}

function TemplateModal({
  open,
  initial,
  onOpenChange,
  onCreate,
  onSaveEdit,
  isDuplicateName,
}: {
  open: boolean;
  initial: AnalysisTemplate | null;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: Omit<AnalysisTemplate, 'id' | 'active'>) => void;
  onSaveEdit: (
    id: string,
    draft: Omit<AnalysisTemplate, 'id' | 'active'>,
  ) => void;
  isDuplicateName: (name: string, excludeId?: string) => boolean;
}) {
  const isEdit = initial !== null;
  const [name, setName] = React.useState(initial?.name ?? '');
  const [question, setQuestion] = React.useState(initial?.question ?? '');
  const [preRefine, setPreRefine] = React.useState<string | null>(null);
  const [refining, setRefining] = React.useState(false);
  const [created, setCreated] = React.useState(false);

  const duplicate =
    name.trim().length > 0 && isDuplicateName(name, initial?.id);
  const canSubmit =
    name.trim().length > 0 && question.trim().length > 0 && !duplicate;

  const handleRefine = () => {
    setRefining(true);
    setTimeout(() => {
      setPreRefine(question);
      setQuestion(refineQuestion(question));
      setRefining(false);
    }, 400);
  };

  const handleRevert = () => {
    if (preRefine !== null) setQuestion(preRefine);
    setPreRefine(null);
  };

  const handleSubmit = () => {
    if (isEdit) {
      onSaveEdit(initial.id, { name: name.trim(), question: question.trim() });
      return;
    }
    setCreated(true);
  };

  const handleDone = () => {
    onCreate({ name: name.trim(), question: question.trim() });
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[520px]'>
        {created ? (
          <>
            <Modal.Body className='flex flex-col items-center gap-3 py-8 text-center'>
              <RiCheckboxCircleFill className='size-10 text-success-base' />
              <h3 className='text-label-md text-text-strong-950'>
                &lsquo;{name.trim()}&rsquo; is ready
              </h3>
              <p className='max-w-[360px] text-paragraph-sm text-text-sub-600'>
                SpotGov will now apply this template to every tender analysis
                across your organization.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button.Root
                variant='primary'
                size='small'
                className='w-full'
                onClick={handleDone}
              >
                Done
              </Button.Root>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header
              title={isEdit ? 'Edit Template' : 'New Template'}
              description={
                isEdit
                  ? 'Update the name and prompt for this template.'
                  : 'Name your template and describe what it should ask.'
              }
            />
            <Modal.Body className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='template-name'>Template name</Label.Root>
                <Input.Root hasError={duplicate}>
                  <Input.Wrapper>
                    <Input.Input
                      id='template-name'
                      placeholder='e.g. Risk Assessment'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {duplicate && (
                  <span className='text-paragraph-xs text-error-base'>
                    A template named &ldquo;{name.trim()}&rdquo; already
                    exists.
                  </span>
                )}
              </div>

              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='template-question'>Prompt</Label.Root>
                <textarea
                  id='template-question'
                  rows={4}
                  placeholder='Describe what this template should look for in every tender…'
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setPreRefine(null);
                  }}
                  className='w-full resize-none rounded-10 bg-bg-white-0 p-3 text-paragraph-sm text-text-strong-950 shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200 transition placeholder:text-text-soft-400 focus:shadow-button-important-focus focus:ring-stroke-strong-950'
                />

                <div className='mt-1 flex items-center gap-3'>
                  <Button.Root
                    variant='primary'
                    mode='lighter'
                    size='xsmall'
                    className='w-fit bg-faded-lighter text-faded-base hover:bg-faded-light'
                    disabled={
                      question.trim().length === 0 ||
                      preRefine !== null ||
                      refining
                    }
                    onClick={handleRefine}
                  >
                    <Button.Icon as={RiSparkling2Line} />
                    {refining ? 'Refining…' : 'Refine with AI'}
                  </Button.Root>
                  {preRefine !== null && (
                    <span className='flex items-center gap-1.5 text-paragraph-xs text-text-sub-600'>
                      Refined with AI
                      <button
                        type='button'
                        onClick={handleRevert}
                        className='text-label-xs text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline'
                      >
                        Revert
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                className='w-full'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button.Root>
              <Button.Root
                variant='primary'
                size='small'
                className='w-full'
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {isEdit ? 'Save Changes' : 'Create Template'}
              </Button.Root>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal.Root>
  );
}
