'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiDraggable,
  RiFileTextLine,
  RiSparkling2Line,
} from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Switch from '@/components/ui/switch';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';
import { cn } from '@/utils/cn';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';
import {
  DEFAULT_TEMPLATES,
  type AnalysisTemplate,
  type TemplateLanguage,
} from './mock-data';

const AI_SUGGESTION =
  'Identify the award criteria and their weightings, then assess how well a typical bid could satisfy the highest-weighted criterion.';

export function AnalysisTemplatesSection() {
  const [templates, setTemplates] =
    React.useState<AnalysisTemplate[]>(DEFAULT_TEMPLATES);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [resetOpen, setResetOpen] = React.useState(false);

  const toggleActive = (id: string) =>
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    );

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

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
        description='Reusable question sets applied when analysing a tender.'
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
          {templates.map((template, index) => {
            const isOpen = expanded[template.id];
            return (
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
                  'rounded-xl ring-1 ring-inset ring-stroke-soft-200 transition-colors',
                  dragIndex === index && 'opacity-50',
                  overIndex === index &&
                    dragIndex !== index &&
                    'ring-2 ring-primary-base',
                )}
              >
                <div className='flex items-center gap-3 p-3'>
                  <span
                    className='shrink-0 cursor-grab text-text-soft-400 active:cursor-grabbing'
                    aria-hidden='true'
                  >
                    <RiDraggable className='size-5' />
                  </span>

                  <div className='flex min-w-0 flex-1 items-center gap-2'>
                    <span className='truncate text-label-sm text-text-strong-950'>
                      {template.name}
                    </span>
                    <Badge.Root variant='light' color='gray' size='medium'>
                      {template.language}
                    </Badge.Root>
                  </div>

                  <button
                    type='button'
                    onClick={() => toggleExpand(template.id)}
                    aria-expanded={isOpen}
                    className='flex shrink-0 items-center gap-1 text-label-sm text-text-sub-600 outline-none transition-colors hover:text-text-strong-950 focus-visible:underline'
                  >
                    Expand
                    <RiArrowDownSLine
                      className={cn(
                        'size-4 transition-transform',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  <label className='flex shrink-0 items-center gap-2'>
                    <span className='sr-only'>
                      Toggle {template.name} active
                    </span>
                    <Switch.Root
                      checked={template.active}
                      onCheckedChange={() => toggleActive(template.id)}
                    />
                  </label>
                </div>

                {isOpen && (
                  <div className='border-t border-stroke-soft-200 p-3 text-paragraph-sm text-text-sub-600'>
                    {template.question}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

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
          setExpanded({});
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
/* Create template modal (2 steps)                                     */
/* ------------------------------------------------------------------ */

function CreateTemplateModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: Omit<AnalysisTemplate, 'id' | 'active'>) => void;
}) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [name, setName] = React.useState('');
  const [language, setLanguage] = React.useState<TemplateLanguage>('EN');
  const [mode, setMode] = React.useState<'generate' | 'write'>('generate');
  const [question, setQuestion] = React.useState('');

  const canContinue = name.trim().length > 0;
  const canCreate = question.trim().length > 0;

  const handleCreate = () => {
    onCreate({
      name: name.trim(),
      language,
      question: question.trim(),
    });
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[520px]'>
        <Modal.Header
          title='New Template'
          description={
            step === 1
              ? 'Name your template and pick its language.'
              : 'Add the question this template should ask.'
          }
        />
        <Modal.Body className='flex flex-col gap-4'>
          {step === 1 ? (
            <>
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
              <div className='flex max-w-[200px] flex-col gap-1'>
                <Label.Root htmlFor='template-language'>Language</Label.Root>
                <Select.Root
                  value={language}
                  onValueChange={(v) => setLanguage(v as TemplateLanguage)}
                >
                  <Select.Trigger id='template-language'>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='EN'>English</Select.Item>
                    <Select.Item value='PT'>Portuguese</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </>
          ) : (
            <>
              <SegmentedControl.Root
                value={mode}
                onValueChange={(v) => setMode(v as 'generate' | 'write')}
              >
                <SegmentedControl.List>
                  <SegmentedControl.Trigger value='generate'>
                    Generate question
                  </SegmentedControl.Trigger>
                  <SegmentedControl.Trigger value='write'>
                    Write your own
                  </SegmentedControl.Trigger>
                </SegmentedControl.List>
              </SegmentedControl.Root>

              {mode === 'generate' ? (
                <div className='flex flex-col gap-3 rounded-xl bg-bg-weak-50 p-4'>
                  <span className='flex items-center gap-1.5 text-label-sm text-text-strong-950'>
                    <RiSparkling2Line className='size-4 text-primary-base' />
                    Suggested question
                  </span>
                  <p className='text-paragraph-sm text-text-sub-600'>
                    {AI_SUGGESTION}
                  </p>
                  <Button.Root
                    variant='primary'
                    mode='lighter'
                    size='xsmall'
                    className='w-fit'
                    onClick={() => setQuestion(AI_SUGGESTION)}
                  >
                    Use this question
                  </Button.Root>
                  {question === AI_SUGGESTION && (
                    <span className='text-paragraph-xs text-success-base'>
                      Added to your template.
                    </span>
                  )}
                </div>
              ) : (
                <div className='flex flex-col gap-1'>
                  <Label.Root htmlFor='template-question'>Question</Label.Root>
                  <textarea
                    id='template-question'
                    rows={4}
                    placeholder='Write the question this template should ask…'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className='w-full resize-none rounded-10 bg-bg-white-0 p-3 text-paragraph-sm text-text-strong-950 shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200 transition placeholder:text-text-soft-400 focus:shadow-button-important-focus focus:ring-stroke-strong-950'
                  />
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            className='w-full'
            onClick={() => (step === 1 ? onOpenChange(false) : setStep(1))}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button.Root>
          {step === 1 ? (
            <Button.Root
              variant='primary'
              size='small'
              className='w-full'
              disabled={!canContinue}
              onClick={() => setStep(2)}
            >
              Continue
            </Button.Root>
          ) : (
            <Button.Root
              variant='primary'
              size='small'
              className='w-full'
              disabled={!canCreate}
              onClick={handleCreate}
            >
              Create Template
            </Button.Root>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
