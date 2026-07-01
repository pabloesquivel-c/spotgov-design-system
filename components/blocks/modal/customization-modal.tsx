'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as LabelPrimitives from '@radix-ui/react-label';
import { RiEqualizer2Line } from '@remixicon/react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Switch from '@/components/ui/switch';
import * as Tag from '@/components/ui/tag';

const formSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      tags: z.array(z.string()),
    }),
  ),
  messagingEnabled: z.boolean(),
  matchingScoreEnabled: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export function CustomizationModal() {
  const [open, setOpen] = React.useState(true);
  const [tempInputs, setTempInputs] = React.useState<Record<string, string>>(
    {},
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sections: [
        {
          id: 'experience',
          label: 'Experience Levels',
          tags: ['Entry Level', 'Internship', 'Mid-level Senior'],
        },
        {
          id: 'sources',
          label: 'Candidate Sources',
          tags: ['LinkedIn', 'Indeed', 'Referral'],
        },
      ],
      messagingEnabled: true,
      matchingScoreEnabled: false,
    },
  });

  const { fields } = useFieldArray({
    name: 'sections',
    control: form.control,
  });

  const handleAddTag = (
    sectionIndex: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newTag = tempInputs[sectionIndex]?.trim();

      if (newTag) {
        const currentTags = form.getValues(`sections.${sectionIndex}.tags`);

        if (
          !currentTags.some(
            (tag) => tag.toLowerCase() === newTag.toLowerCase(),
          )
        ) {
          form.setValue(`sections.${sectionIndex}.tags`, [
            ...currentTags,
            newTag,
          ]);
          setTempInputs((prev) => ({ ...prev, [sectionIndex]: '' }));
        }
      }
    }
  };

  const handleRemoveTag = (sectionIndex: number, tagIndex: number) => {
    const currentTags = form.getValues(`sections.${sectionIndex}.tags`);
    form.setValue(
      `sections.${sectionIndex}.tags`,
      currentTags.filter((_, index) => index !== tagIndex),
    );
  };

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Modal
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header
          icon={RiEqualizer2Line}
          title='Customization'
          description='Customise your recruitment module.'
        />
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
            setOpen(false);
          })}
        >
          <Modal.Body className='flex flex-col gap-5'>
            {fields.map((section, sectionIndex) => (
              <div key={section.id} className='flex flex-col items-start gap-1'>
                <Label.Root htmlFor={section.id}>
                  {section.label}
                  <Label.Sub>(max. 4)</Label.Sub>
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id={section.id}
                      autoFocus={sectionIndex === 0}
                      placeholder='Add tags...'
                      value={tempInputs[sectionIndex] || ''}
                      onChange={(event) =>
                        setTempInputs((prev) => ({
                          ...prev,
                          [sectionIndex]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => handleAddTag(sectionIndex, event)}
                    />
                  </Input.Wrapper>
                </Input.Root>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {form
                    .watch(`sections.${sectionIndex}.tags`)
                    .map((tag, tagIndex) => (
                      <Tag.Root key={tag}>
                        {tag}
                        <Tag.DismissButton
                          onClick={() => handleRemoveTag(sectionIndex, tagIndex)}
                        />
                      </Tag.Root>
                    ))}
                </div>
              </div>
            ))}
            <div className='flex items-center gap-2'>
              <Switch.Root
                id='customization-messaging'
                checked={form.watch('messagingEnabled')}
                onCheckedChange={(checked) =>
                  form.setValue('messagingEnabled', checked)
                }
              />
              <LabelPrimitives.Root
                htmlFor='customization-messaging'
                className='cursor-pointer text-paragraph-sm text-text-strong-950'
              >
                Messaging Settings
              </LabelPrimitives.Root>
            </div>
            <div className='flex items-center gap-2'>
              <Switch.Root
                id='customization-matching-score'
                checked={form.watch('matchingScoreEnabled')}
                onCheckedChange={(checked) =>
                  form.setValue('matchingScoreEnabled', checked)
                }
              />
              <LabelPrimitives.Root
                htmlFor='customization-matching-score'
                className='cursor-pointer text-paragraph-sm text-text-strong-950'
              >
                Matching Score
              </LabelPrimitives.Root>
            </div>
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
            <Button.Root type='submit' size='small' className='w-full'>
              Save Changes
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
