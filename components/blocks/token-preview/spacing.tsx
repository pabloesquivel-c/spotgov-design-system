import {
  ArticleGallery,
  ArticleGalleryRow,
  ArticleParagraph,
  ArticleSection,
  ArticleSubsection,
  articleTag,
  articleToken,
} from './article';

const denseSteps = [
  { label: '4px', utility: 'gap-1 / p-1', className: 'gap-1' },
  { label: '8px', utility: 'gap-2 / p-2', className: 'gap-2' },
  { label: '12px', utility: 'gap-3 / p-3', className: 'gap-3' },
  { label: '16px', utility: 'gap-4 / p-4', className: 'gap-4' },
] as const;

const breathableSteps = [
  { label: '8px', utility: 'gap-2', className: 'gap-2' },
  { label: '16px', utility: 'gap-4', className: 'gap-4' },
  { label: '24px', utility: 'gap-6', className: 'gap-6' },
  { label: '32px', utility: 'gap-8', className: 'gap-8' },
] as const;

function SpacingRow({
  label,
  utility,
  className,
}: {
  label: string;
  utility: string;
  className: string;
}) {
  return (
    <ArticleGalleryRow>
      <div className={`flex ${className}`}>
        <div className='size-5 rounded bg-primary-alpha-16 ring-1 ring-primary-alpha-24' />
        <div className='size-5 rounded bg-primary-alpha-16 ring-1 ring-primary-alpha-24' />
        <div className='size-5 rounded bg-primary-alpha-16 ring-1 ring-primary-alpha-24' />
      </div>
      <div className='flex items-baseline gap-3'>
        <p className='text-[14px] font-medium text-[var(--article-heading)]'>
          {label}
        </p>
        <code className={articleTag}>{utility}</code>
      </div>
    </ArticleGalleryRow>
  );
}

export function SpacingSection() {
  return (
    <ArticleSection title='Spacing'>
      <ArticleParagraph>
        Spacing follows a dual-density rhythm on a 4px grid. Dense spacing keeps
        data views compact. Breathable spacing gives cards and sections room to
        breathe. Both live in the same system; the context decides which to use.
      </ArticleParagraph>

      <ArticleSubsection title='Dense rhythm'>
        <ArticleParagraph>
          Use inside tables, toolbars, menus, and inline controls. Step by 4px
          and cap at 16px. Tight gaps keep related items visually grouped.
        </ArticleParagraph>
        <ArticleGallery>
          {denseSteps.map((step) => (
            <SpacingRow key={step.label} {...step} />
          ))}
        </ArticleGallery>
      </ArticleSubsection>

      <ArticleSubsection title='Breathable rhythm'>
        <ArticleParagraph>
          Use between cards, widgets, and page sections. Default to{' '}
          <code className={articleToken}>gap-6</code> (24px) between widgets,{' '}
          <code className={articleToken}>gap-8</code> (32px) between sections,
          and <code className={articleToken}>p-6</code> (24px) for card padding.
        </ArticleParagraph>
        <ArticleGallery>
          {breathableSteps.map((step) => (
            <SpacingRow key={`b-${step.label}`} {...step} />
          ))}
        </ArticleGallery>
      </ArticleSubsection>
    </ArticleSection>
  );
}
