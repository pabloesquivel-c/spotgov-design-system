'use client';

import * as React from 'react';
import { RiSparkling2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Switch from '@/components/ui/switch';
import * as Textarea from '@/components/ui/textarea';
import { notification } from '@/hooks/use-notification';

type Template = {
  id: string;
  name: string;
  question: string;
  active: boolean;
};

const DEFAULTS: Template[] = [
  {
    id: 'standard-review',
    name: 'Standard review',
    question: 'Summarize scope, eligibility requirements, and deadlines.',
    active: true,
  },
  {
    id: 'compliance-check',
    name: 'Compliance check',
    question: 'List every compliance clause and required document.',
    active: false,
  },
  {
    id: 'deadline-scope',
    name: 'Deadline and scope',
    question: 'Identify scope risks and critical submission dates.',
    active: false,
  },
];

type AnalysisTemplatesModalSectionProps = {
  onNewTemplateActionChange: (action: (() => void) | null) => void;
};

export function AnalysisTemplatesModalSection({
  onNewTemplateActionChange,
}: AnalysisTemplatesModalSectionProps) {
  const [templates, setTemplates] = React.useState(DEFAULTS);
  const [editing, setEditing] = React.useState<Template | 'new' | null>(null);

  React.useEffect(() => {
    onNewTemplateActionChange(() => setEditing('new'));
    return () => onNewTemplateActionChange(null);
  }, [onNewTemplateActionChange]);

  return (
    <>
      <ul className='flex flex-col gap-3'>
        {templates.map((template) => (
          <li
            key={template.id}
            className='flex items-center gap-4 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'
          >
            <div className='min-w-0 flex-1'>
              <p className='text-label-sm text-text-strong-950'>
                {template.name}
              </p>
              <p className='mt-1 text-paragraph-xs text-text-sub-600'>
                {template.question}
              </p>
            </div>
            <Switch.Root
              checked={template.active}
              aria-label={'Toggle ' + template.name}
              onCheckedChange={() =>
                setTemplates((previous) =>
                  previous.map((item) =>
                    item.id === template.id
                      ? { ...item, active: !item.active }
                      : item,
                  ),
                )
              }
            />
          </li>
        ))}
      </ul>

      <TemplateModal
        open={editing !== null}
        initial={editing === 'new' ? null : editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={(draft) => {
          if (editing === 'new') {
            setTemplates((previous) => [
              ...previous,
              { ...draft, id: String(previous.length + 1), active: true },
            ]);
          }
          setEditing(null);
          notification({ status: 'success', title: 'Template saved' });
        }}
      />
    </>
  );
}

function TemplateModal({
  open,
  initial,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  initial: Template | null;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: Omit<Template, 'id' | 'active'>) => void;
}) {
  const [name, setName] = React.useState(initial?.name ?? '');
  const [question, setQuestion] = React.useState(initial?.question ?? '');

  React.useEffect(() => {
    setName(initial?.name ?? '');
    setQuestion(initial?.question ?? '');
  }, [initial, open]);

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[560px]'>
        <Modal.Header
          title={initial ? 'Edit template' : 'New template'}
          description='Define an organization-wide tender analysis category.'
        />
        <Modal.Body className='flex flex-col gap-4'>
          <div>
            <Label.Root htmlFor='template-name'>Name</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='template-name'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div>
            <Label.Root htmlFor='template-question'>Question</Label.Root>
            <Textarea.Root
              id='template-question'
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </div>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            className='w-fit'
            onClick={() =>
              setQuestion(
                (value) =>
                  value.trim().replace(/\.*$/, '') +
                  '. Cite the tender clause supporting each finding.',
              )
            }
          >
            <Button.Icon as={RiSparkling2Line} />
            Refine with AI
          </Button.Root>
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
            disabled={!name.trim() || !question.trim()}
            onClick={() => onSave({ name, question })}
          >
            Save template
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
