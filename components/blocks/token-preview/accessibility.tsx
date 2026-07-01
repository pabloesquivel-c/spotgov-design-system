import {
  ArticleGallery,
  ArticleParagraph,
  ArticleSection,
  ArticleSubsection,
  articleToken,
} from './article';

const checks = [
  {
    title: 'Contrast',
    body: 'Use text-sub-600 or stronger for 12-14px readable text on bg-white-0. text-soft-400 is decorative only.',
  },
  {
    title: 'Focus',
    body: 'Every interactive element needs a visible focus-visible state using the existing focus shadows or a strong ring.',
  },
  {
    title: 'Status',
    body: 'Awarded, pending, rejected, and disabled states need text plus a redundant icon or shape, not color alone.',
  },
  {
    title: 'States',
    body: 'Buttons document default, hover, pressed, focus-visible, disabled, and loading states.',
  },
] as const;

export function AccessibilitySection() {
  return (
    <ArticleSection title='Accessibility'>
      <ArticleParagraph>
        SpotGov product UI targets WCAG 2.1 AA. The key rule for daily work is
        simple: readable information must meet contrast, focus must be visible,
        and status must not depend on hue alone.
      </ArticleParagraph>

      <ArticleGallery className='grid gap-4 sm:grid-cols-2'>
        {checks.map((item) => (
          <div
            key={item.title}
            className='rounded-16 bg-bg-white-0 p-4 ring-1 ring-inset ring-stroke-soft-200'
          >
            <p className='text-sg-label text-text-strong-950'>{item.title}</p>
            <p className='mt-2 text-sg-body text-text-sub-600'>{item.body}</p>
          </div>
        ))}
      </ArticleGallery>

      <ArticleSubsection title='Contrast pairings'>
        <ArticleParagraph>
          Metadata and timestamps use{' '}
          <code className={articleToken}>text-sub-600</code>. Avoid{' '}
          <code className={articleToken}>text-soft-400</code> for task-critical
          12-14px text on <code className={articleToken}>bg-white-0</code>.
        </ArticleParagraph>
      </ArticleSubsection>
    </ArticleSection>
  );
}
