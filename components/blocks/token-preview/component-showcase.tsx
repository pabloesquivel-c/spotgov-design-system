import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Hint from '@/components/ui/hint';
import * as StatusBadge from '@/components/ui/status-badge';
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
} from '@remixicon/react';
import {
  Input as InputField,
  Root as InputRoot,
  Wrapper as InputWrapper,
} from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import {
  ArticleGallery,
  ArticleParagraph,
  ArticleSection,
  ArticleSubsection,
} from './article';

export function ComponentShowcase() {
  return (
    <ArticleSection title='Components'>
      <ArticleParagraph>
        These are the AlignUI primitives we use daily, with SpotGov token
        overrides applied. They inherit the colors, radius, and shadows above.
        Start here when building forms, actions, and status indicators.
      </ArticleParagraph>

      <ArticleSubsection title='Buttons'>
        <ArticleParagraph>
          Primary buttons use filled blue for the main action on a screen.
          Stroke and lighter variants step back for secondary choices. Ghost
          works for toolbar actions. Neutral and error variants cover the rest.
          Buttons include hover, pressed, focus-visible, disabled, and loading
          states.
        </ArticleParagraph>
        <ArticleGallery className='space-y-4'>
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
          <div className='flex flex-wrap items-center gap-3'>
            <Button.Root variant='primary' disabled>
              Disabled
            </Button.Root>
            <Button.Root variant='primary' loading>
              Loading
            </Button.Root>
            <Button.Root variant='neutral' mode='stroke' loading>
              Syncing
            </Button.Root>
          </div>
        </ArticleGallery>
      </ArticleSubsection>

      <ArticleSubsection title='Badges'>
        <ArticleParagraph>
          Filled badges use data visualization colors for categories like agency
          type. Workflow state uses StatusBadge with text plus an icon or shape,
          so awarded, pending review, and rejected are not communicated by color
          alone.
        </ArticleParagraph>
        <ArticleGallery className='space-y-3'>
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
          <div className='flex flex-wrap gap-2'>
            <StatusBadge.Root variant='light' status='completed'>
              <StatusBadge.Icon as={RiCheckboxCircleLine} />
              Awarded
            </StatusBadge.Root>
            <StatusBadge.Root variant='light' status='pending'>
              <StatusBadge.Icon as={RiTimeLine} />
              Pending review
            </StatusBadge.Root>
            <StatusBadge.Root variant='light' status='failed'>
              <StatusBadge.Icon as={RiCloseCircleLine} />
              Rejected
            </StatusBadge.Root>
          </div>
        </ArticleGallery>
      </ArticleSubsection>

      <ArticleSubsection title='Inputs'>
        <ArticleParagraph>
          Labels sit above fields. Hints below explain format or constraints.
          Disabled states fade both the field and its helper text.
        </ArticleParagraph>
        <ArticleGallery className='space-y-6'>
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
            <Hint.Root>Search by full or partial agency name.</Hint.Root>
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
            <Hint.Root disabled>Assigned after submission.</Hint.Root>
          </div>
        </ArticleGallery>
      </ArticleSubsection>
    </ArticleSection>
  );
}
