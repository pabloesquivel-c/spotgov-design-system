import {
  ArticleGallery,
  ArticleGalleryGrid,
  ArticleParagraph,
  ArticleSection,
  articleTag,
} from './article';

const shadowSamples = [
  {
    name: 'Resting',
    utility: 'shadow-regular-xs',
    usage: 'Inputs, selects, cards',
  },
  {
    name: 'Floating',
    utility: 'shadow-regular-md',
    usage: 'Dropdowns, modals, popovers',
  },
] as const;

export function ShadowsSection() {
  return (
    <ArticleSection title='Shadows'>
      <ArticleParagraph>
        SpotGov uses two shadows. At rest, surfaces prefer a subtle ring border.
        When something lifts off the page, a single shadow carries the depth.
        Never combine multiple shadows on one element.
      </ArticleParagraph>

      <ArticleGallery>
        <ArticleGalleryGrid columns={2}>
          {shadowSamples.map((item) => (
            <div key={item.name} className='flex flex-col items-center gap-3'>
              <div
                className={`flex h-24 w-full items-center justify-center rounded-sg-lg bg-bg-white-0 ring-1 ring-stroke-soft-200 ${item.utility}`}
              >
                <span className='text-[14px] font-medium text-[var(--article-heading)]'>
                  Preview
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
