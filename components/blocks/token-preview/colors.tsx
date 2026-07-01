import { ColorSwatch, SwatchRow } from './color-swatch';
import {
  ArticleGallery,
  ArticleParagraph,
  ArticleSection,
  ArticleSubsection,
  articleToken,
} from './article';

export function ColorsSection() {
  return (
    <ArticleSection title='Color'>
      <ArticleParagraph>
        Color in SpotGov stays quiet. Neutrals carry most of the interface.
        Blue appears where something is actionable or selected. Status colors
        appear only when they need to communicate feedback.
      </ArticleParagraph>

      <ArticleSubsection title='Primary'>
        <ArticleParagraph>
          There is one visible brand blue: <code className={articleToken}>primary-base</code>.
          Use it for primary buttons, links, active navigation, focus rings,
          and selected states. Lighter and darker steps exist for hover, press,
          and subtle tinted backgrounds. They are the same hue, not separate
          accents.
        </ArticleParagraph>
        <ArticleGallery>
          <SwatchRow>
            <ColorSwatch name='primary-base' cssVar='--primary-base' />
            <ColorSwatch name='primary-darker' cssVar='--primary-darker' />
            <ColorSwatch name='primary-dark' cssVar='--primary-dark' />
            <ColorSwatch name='primary-alpha-24' cssVar='--primary-alpha-24' />
            <ColorSwatch name='primary-alpha-16' cssVar='--primary-alpha-16' />
            <ColorSwatch name='primary-alpha-10' cssVar='--primary-alpha-10' />
          </SwatchRow>
        </ArticleGallery>
      </ArticleSubsection>

      <ArticleSubsection title='Neutral surfaces and text'>
        <ArticleParagraph>
          Backgrounds, text, and borders share a semantic stack from AlignUI.
          Page canvas is <code className={articleToken}>bg-white-0</code>.
          Subtle panels use <code className={articleToken}>bg-weak-50</code>.
          Headings read in <code className={articleToken}>text-strong-950</code>,
          descriptions and metadata in <code className={articleToken}>text-sub-600</code>,
          and dividers in <code className={articleToken}>stroke-soft-200</code>.
          Use <code className={articleToken}>text-soft-400</code> only for
          decorative low-emphasis text on white surfaces.
        </ArticleParagraph>
        <ArticleGallery>
          <SwatchRow>
            <ColorSwatch name='bg-white-0' cssVar='--bg-white-0' />
            <ColorSwatch name='bg-weak-50' cssVar='--bg-weak-50' />
            <ColorSwatch name='bg-soft-200' cssVar='--bg-soft-200' />
            <ColorSwatch name='text-strong-950' cssVar='--text-strong-950' />
            <ColorSwatch name='text-sub-600' cssVar='--text-sub-600' />
            <ColorSwatch name='text-soft-400' cssVar='--text-soft-400' />
            <ColorSwatch name='stroke-soft-200' cssVar='--stroke-soft-200' />
            <ColorSwatch name='stroke-sub-300' cssVar='--stroke-sub-300' />
          </SwatchRow>
        </ArticleGallery>
      </ArticleSubsection>

      <ArticleSubsection title='Status'>
        <ArticleParagraph>
          Three core feedback colors cover most product states. Warning for
          approaching deadlines and non-blocking issues. Error for failures and
          destructive actions. Success for completed steps and confirmed
          outcomes. Status UI must pair color with label text plus an icon or
          shape.
        </ArticleParagraph>
        <ArticleGallery>
          <SwatchRow>
            <ColorSwatch name='warning-base' cssVar='--warning-base' />
            <ColorSwatch name='error-base' cssVar='--error-base' />
            <ColorSwatch name='success-base' cssVar='--success-base' />
          </SwatchRow>
        </ArticleGallery>
      </ArticleSubsection>

      <ArticleSubsection title='Feature and workflow'>
        <ArticleParagraph>
          Feature purple highlights AI capabilities, beta badges, and premium
          moments. Away orange marks drafts, pending review, and in-progress
          workflow states without implying error.
        </ArticleParagraph>
        <ArticleGallery>
          <SwatchRow>
            <ColorSwatch name='feature-base' cssVar='--feature-base' />
            <ColorSwatch name='away-base' cssVar='--away-base' />
          </SwatchRow>
        </ArticleGallery>
      </ArticleSubsection>

      <ArticleSubsection title='Utility'>
        <ArticleParagraph>
          Faded tones signal archived or inactive records. Information blue is
          for tips, help callouts, and neutral informational banners.
        </ArticleParagraph>
        <ArticleGallery>
          <SwatchRow>
            <ColorSwatch name='faded-base' cssVar='--faded-base' />
            <ColorSwatch name='information-base' cssVar='--information-base' />
          </SwatchRow>
        </ArticleGallery>
      </ArticleSubsection>
    </ArticleSection>
  );
}
