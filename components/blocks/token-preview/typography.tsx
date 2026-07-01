'use client';

import { useState } from 'react';
import { RiEditLine, RiRefreshLine } from '@remixicon/react';
import {
  Input as InputField,
  Root as InputRoot,
  Wrapper as InputWrapper,
} from '@/components/ui/input';
import {
  ArticleGallery,
  ArticleGalleryRow,
  ArticleParagraph,
  ArticleSection,
  articleTag,
  articleToken,
} from './article';

const typeSamples = [
  {
    token: 'Page title',
    utility: 'text-title-h6',
    spec: '20/500',
    sample: 'Procurement dashboard',
    note: 'Top of a page or detail view, one per screen',
  },
  {
    token: 'Section heading',
    utility: 'text-label-md',
    spec: '16/500',
    sample: 'Active opportunities',
    note: 'Card headers, modal titles, settings groups',
  },
  {
    token: 'Body',
    utility: 'text-paragraph-sm',
    spec: '14/400',
    sample: 'Find, track, and win government contracts.',
    note: 'Descriptions, table cells, form helpers',
  },
  {
    token: 'Label',
    utility: 'text-label-sm',
    spec: '14/500',
    sample: 'Contract status',
    note: 'Field labels, column headers, button text',
  },
  {
    token: 'Caption',
    utility: 'text-paragraph-xs',
    spec: '12/400',
    sample: 'Updated 2 hours ago',
    note: 'Timestamps, footnotes, secondary metadata',
  },
  {
    token: 'Micro label',
    utility: 'text-label-xs',
    spec: '12/500',
    sample: 'Filter by agency',
    note: 'Badges, tags, compact table headers',
  },
] as const;

export function TypographySection() {
  const [preview, setPreview] = useState('');
  const isPreviewing = preview.trim().length > 0;

  return (
    <ArticleSection title='Typography'>
      <ArticleParagraph>
        SpotGov uses six text roles. Two weights only: 400 for reading copy and
        500 for emphasis. Hierarchy comes from size and color, not from a large
        type scale. Inter is the sole typeface.
      </ArticleParagraph>

      <ArticleGallery>
        <div className='mb-6 flex items-center gap-2.5 border-b border-[var(--article-gallery-divider)] pb-6'>
          <InputRoot size='medium' className='flex-1'>
            <InputWrapper>
              <RiEditLine
                className='size-4 text-[var(--article-meta)]'
                aria-hidden
              />
              <InputField
                value={preview}
                onChange={(event) => setPreview(event.target.value)}
                placeholder='Type your own text to preview it in every style below'
              />
            </InputWrapper>
          </InputRoot>
          {isPreviewing ? (
            <button
              type='button'
              onClick={() => setPreview('')}
              aria-label='Reset preview text'
              className='flex size-9 shrink-0 items-center justify-center rounded-10 text-[var(--article-meta)] transition-colors hover:bg-black/5 hover:text-[var(--article-heading)]'
            >
              <RiRefreshLine className='size-4' />
            </button>
          ) : null}
        </div>

        {typeSamples.map((item) => (
          <ArticleGalleryRow key={item.token}>
            <div className='min-w-0'>
              <p className={`${item.utility} text-[var(--article-heading)]`}>
                {isPreviewing ? preview : item.sample}
              </p>
              <p className='mt-1.5 text-[13px] leading-[18px] text-[var(--article-meta)]'>
                {item.token} · {item.spec} — {item.note}
              </p>
            </div>
            <code className={`${articleTag} shrink-0`}>{item.utility}</code>
          </ArticleGalleryRow>
        ))}
      </ArticleGallery>

      <ArticleParagraph>
        Pair text color with intent. Primary copy uses{' '}
        <code className={articleToken}>text-strong-950</code>. Supporting copy
        uses <code className={articleToken}>text-sub-600</code>. Metadata and
        timestamps use <code className={articleToken}>text-soft-400</code>.
      </ArticleParagraph>
    </ArticleSection>
  );
}
