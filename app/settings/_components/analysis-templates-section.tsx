'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiCheckboxCircleFill,
  RiDraggable,
  RiFileTextLine,
  RiInformationLine,
  RiSparkling2Line,
} from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
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

  const [createOpen, setCreateOpen] = React.useState(false);
  const [resetOpen, setResetOpen] = React.useState(false);

  const toggleActive = (id: string) =>
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    );

  const handleDrop = (target: number) => {
    setOverIndex(null);
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null);
      return;
    }
    setTemplates((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  const addTemplate = (draft: Omit<AnalysisTemplate, 'id' | 'active'>) => {
    setTemplates((prev) => [
      ...prev,
      { ...draft, id: `custom-${prev.length}-${draft.name}`, active: true },
    ]);
    setCreateOpen(false);
    notification({ status: 'success', title: `${draft.name} created` });
  };

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
              onClick={() => setCreateOpen(true)}
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
              <span
                className='shrink-0 cursor-grab text-text-soft-400 active:cursor-grabbing'
                aria-hidden='true'
              >
                <RiDraggable className='size-5' />
              </span>

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
            </li>
          ))}
        </ul>

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
          Drag the handle to reorder templates. Reordering is stored in local
          state only for this preview.
        </DemoNote>
      </SettingsCard>

      <CreateTemplateModal
        key={createOpen ? 'open' : 'closed'}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={addTemplate}
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
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Create template modal (single screen + AI refine + confirmation)    */
/* ------------------------------------------------------------------ */

function refineQuestion(question: string) {
  const trimmed = question.trim().replace(/\.+$/, '');
  return `${trimmed}. Cite the specific tender clause or section that supports each finding, and flag anything ambiguous for manual review.`;
}

function CreateTemplateModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: Omit<AnalysisTemplate, 'id' | 'active'>) => void;
}) {
  const [name, setName] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [preRefine, setPreRefine] = React.useState<string | null>(null);
  const [created, setCreated] = React.useState(false);

  const canCreate = name.trim().length > 0 && question.trim().length > 0;

  const handleRefine = () => {
    setPreRefine(question);
    setQuestion(refineQuestion(question));
  };

  const handleRevert = () => {
    if (preRefine !== null) setQuestion(preRefine);
    setPreRefine(null);
  };

  const handleCreate = () => {
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
              title='New Template'
              description='Name your template and describe what it should ask.'
            />
            <Modal.Body className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='template-name'>Template name</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='template-name'
                      placeholder='e.g. Risk Assessment'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Input.Wrapper>
                </Input.Root>
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
                    disabled={question.trim().length === 0}
                    onClick={handleRefine}
                  >
                    <Button.Icon as={RiSparkling2Line} />
                    Refine with AI
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
                disabled={!canCreate}
                onClick={handleCreate}
              >
                Create Template
              </Button.Root>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal.Root>
  );
}
