import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Hint from '@/components/ui/hint';
import {
  Input as InputField,
  Root as InputRoot,
  Wrapper as InputWrapper,
} from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { Section } from './section';

export function ComponentShowcase() {
  return (
    <Section
      title='Components'
      description='AlignUI components styled with SpotGov tokens — buttons, badges, and form inputs.'
    >
      <div className='flex flex-col gap-12'>
        <div>
          <h3 className='mb-4 text-sg-label text-text-strong-950'>Button</h3>
          <div className='flex flex-col gap-6 rounded-sg-lg bg-bg-weak-50 p-6 ring-1 ring-inset ring-stroke-soft-200'>
            <div className='flex flex-wrap gap-3'>
              <Button.Root variant='primary' mode='filled'>
                Primary filled
              </Button.Root>
              <Button.Root variant='primary' mode='stroke'>
                Primary stroke
              </Button.Root>
              <Button.Root variant='primary' mode='lighter'>
                Primary lighter
              </Button.Root>
              <Button.Root variant='primary' mode='ghost'>
                Primary ghost
              </Button.Root>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button.Root variant='neutral' mode='stroke'>
                Neutral stroke
              </Button.Root>
              <Button.Root variant='error' mode='filled'>
                Error filled
              </Button.Root>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <Button.Root variant='primary' size='medium'>
                Medium
              </Button.Root>
              <Button.Root variant='primary' size='small'>
                Small
              </Button.Root>
              <Button.Root variant='primary' size='xsmall'>
                XSmall
              </Button.Root>
              <Button.Root variant='primary' size='xxsmall'>
                XXSmall
              </Button.Root>
            </div>
          </div>
        </div>

        <div>
          <h3 className='mb-4 text-sg-label text-text-strong-950'>Badge</h3>
          <div className='flex flex-col gap-6 rounded-sg-lg bg-bg-weak-50 p-6 ring-1 ring-inset ring-stroke-soft-200'>
            <div>
              <p className='mb-3 text-sg-metadata text-text-sub-600'>
                Data viz / tag colors (filled)
              </p>
              <div className='flex flex-wrap gap-2'>
                <Badge.Root variant='filled' color='blue'>
                  Federal
                </Badge.Root>
                <Badge.Root variant='filled' color='teal'>
                  State
                </Badge.Root>
                <Badge.Root variant='filled' color='orange'>
                  Local
                </Badge.Root>
                <Badge.Root variant='filled' color='pink'>
                  Education
                </Badge.Root>
                <Badge.Root variant='filled' color='purple'>
                  Defense
                </Badge.Root>
                <Badge.Root variant='filled' color='green'>
                  Healthcare
                </Badge.Root>
              </div>
            </div>
            <div>
              <p className='mb-3 text-sg-metadata text-text-sub-600'>
                Semantic status (light)
              </p>
              <div className='flex flex-wrap gap-2'>
                <Badge.Root variant='light' color='green'>
                  Awarded
                </Badge.Root>
                <Badge.Root variant='light' color='orange'>
                  Pending review
                </Badge.Root>
                <Badge.Root variant='light' color='red'>
                  Rejected
                </Badge.Root>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className='mb-4 text-sg-label text-text-strong-950'>
            Input + Label
          </h3>
          <div className='flex flex-col gap-6 rounded-sg-lg bg-bg-weak-50 p-6 ring-1 ring-inset ring-stroke-soft-200'>
            <div className='max-w-sm space-y-1.5'>
              <Label.Root htmlFor='agency-input'>
                Agency name
                <Label.Sub> (required)</Label.Sub>
              </Label.Root>
              <InputRoot>
                <InputWrapper>
                  <InputField
                    id='agency-input'
                    placeholder='e.g. Department of Defense'
                  />
                </InputWrapper>
              </InputRoot>
              <Hint.Root>
                Search by full or partial agency name.
              </Hint.Root>
            </div>
            <div className='max-w-sm space-y-1.5'>
              <Label.Root htmlFor='disabled-input' disabled>
                Contract ID
              </Label.Root>
              <InputRoot>
                <InputWrapper>
                  <InputField
                    id='disabled-input'
                    placeholder='Auto-generated'
                    disabled
                  />
                </InputWrapper>
              </InputRoot>
              <Hint.Root disabled>
                Assigned after submission.
              </Hint.Root>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
