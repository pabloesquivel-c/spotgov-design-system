import {
  ArticleGallery,
  ArticleGalleryGrid,
  ArticleParagraph,
  ArticleSection,
  articleTag,
} from './article';

const radiusSamples = [
  {
    name: 'Micro',
    utility: 'rounded-lg',
    cssVar: '--radius-sm',
    value: '8px',
    usage: 'Tags, badges',
  },
  {
    name: 'Default',
    utility: 'rounded-10',
    cssVar: '--radius',
    value: '12px',
    usage: 'Buttons, inputs, nav',
  },
  {
    name: 'Surface',
    utility: 'rounded-sg-lg',
    cssVar: '--radius-lg',
    value: '16px',
    usage: 'Cards, widgets',
  },
  {
    name: 'Overlay',
    utility: 'rounded-20',
    cssVar: null,
    value: '20px',
    usage: 'Modals, popovers',
  },
] as const;

export function RadiusSection() {
  return (
    <ArticleSection title='Radius'>
      <ArticleParagraph>
        Corners in SpotGov sit in a 12 to 16px band. Interactives get at least
        12px. Containers feel soft without becoming pill-shaped. Data tables
        stay flat inside; round the wrapper, not every cell.
      </ArticleParagraph>

      <ArticleGallery>
        <ArticleGalleryGrid columns={4}>
          {radiusSamples.map((item) => (
            <div key={item.name} className='flex flex-col items-center gap-3'>
              <div
                className='flex h-20 w-full items-center justify-center bg-[var(--article-gallery-bg)] ring-1 ring-inset ring-black/10'
                style={{
                  borderRadius:
                    item.cssVar === null ? '1.25rem' : `var(${item.cssVar})`,
                  backgroundColor: 'var(--color-stone-50)',
                }}
              >
                <span className='text-[14px] font-medium text-[var(--article-heading)]'>
                  {item.value}
                </span>
              </div>
              <div className='text-center'>
                <p className='text-[14px] font-medium text-[var(--article-heading)]'>
                  {item.name}
                </p>
                <p className='mt-0.5 text-[12px] leading-4 text-[var(--article-meta)]'>
                  {item.usage}
                </p>
                <code className={`${articleTag} mt-1 block`}>
                  {item.utility}
                </code>
              </div>
            </div>
          ))}
        </ArticleGalleryGrid>
      </ArticleGallery>
    </ArticleSection>
  );
}
