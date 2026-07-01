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
    utility: 'rounded-8',
    legacyUtility: 'rounded-lg',
    cssVar: '--radius-sm',
    value: '8px',
    usage: 'Tags, badges',
  },
  {
    name: 'Default',
    utility: 'rounded-12',
    legacyUtility: 'rounded-10',
    cssVar: '--radius',
    value: '12px',
    usage: 'Buttons, inputs, nav',
  },
  {
    name: 'Surface',
    utility: 'rounded-16',
    legacyUtility: 'rounded-sg-lg',
    cssVar: '--radius-lg',
    value: '16px',
    usage: 'Cards, widgets',
  },
  {
    name: 'Overlay',
    utility: 'rounded-20',
    legacyUtility: 'rounded-sg-overlay',
    cssVar: null,
    value: '20px',
    usage: 'Modals, popovers',
  },
] as const;

export function RadiusSection() {
  return (
    <ArticleSection title='Radius'>
      <ArticleParagraph>
        Corners in SpotGov sit in a 12 to 16px band. New UI uses readable
        numeric aliases: 8, 12, 16, and 20px. Interactives get at least 12px.
        Data tables stay flat inside; round the wrapper, not every cell.
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
                <p className='mt-1 text-[11px] leading-4 text-[var(--article-meta)]'>
                  Alias: {item.legacyUtility}
                </p>
              </div>
            </div>
          ))}
        </ArticleGalleryGrid>
      </ArticleGallery>
    </ArticleSection>
  );
}
