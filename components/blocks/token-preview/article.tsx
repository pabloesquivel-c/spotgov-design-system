import { cn } from '@/utils/cn';

export const articleBody =
  'text-[17px] font-normal leading-[28px] text-[var(--article-text)]';
export const articleHeading =
  'text-[22px] font-medium leading-[30px] tracking-[-0.01em] text-[var(--article-heading)]';
export const articleSubheading =
  'text-[13px] font-medium uppercase leading-[18px] tracking-[0.06em] text-[var(--article-meta)]';
export const articleTitle =
  'text-[32px] font-medium leading-[40px] tracking-[-0.02em] text-[var(--article-heading)]';
export const articleEyebrow =
  'text-[14px] leading-5 text-[var(--article-meta)]';
export const articleMeta =
  'text-[13px] leading-[18px] text-[var(--article-meta)]';
export const articleToken =
  'rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[14px] text-[var(--article-heading)] bg-[var(--color-stone-200)]/60';
export const articleTag =
  'font-[family-name:var(--font-geist-mono)] text-[12px] text-[var(--article-meta)]';

type ArticleLayoutProps = {
  children: React.ReactNode;
};

export function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <article
      className={cn(
        'article-preview mx-auto w-full max-w-2xl px-6 pb-24 pt-16 md:px-8',
        '[&>section.article-section:first-of-type_.section-rule]:hidden',
      )}
    >
      {children}
    </article>
  );
}

type ArticleHeaderProps = {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
};

export function ArticleHeader({ eyebrow, title, children }: ArticleHeaderProps) {
  return (
    <header className='mb-20'>
      {eyebrow ? <p className={articleEyebrow}>{eyebrow}</p> : null}
      <h1 className={cn(articleTitle, eyebrow && 'mt-3')}>{title}</h1>
      {children ? <div className='mt-6 space-y-5'>{children}</div> : null}
    </header>
  );
}

type ArticleRuleProps = {
  className?: string;
};

export function ArticleRule({ className }: ArticleRuleProps) {
  return (
    <hr
      aria-hidden
      className={cn(
        'mx-auto h-px w-10 shrink-0 border-0 bg-[var(--article-rule)]',
        className,
      )}
    />
  );
}

type ArticleSectionProps = {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function ArticleSection({
  id,
  title,
  children,
  className,
}: ArticleSectionProps) {
  return (
    <section id={id} className={cn('article-section mt-28 first:mt-0', className)}>
      <ArticleRule className='section-rule mb-10' />
      <h2 className={articleHeading}>{title}</h2>
      <div className='article-section-body mt-8 space-y-8 [&>.article-subsection]:space-y-4 [&>.article-subsection~.article-subsection]:mt-24'>
        {children}
      </div>
    </section>
  );
}

type ArticleParagraphProps = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleParagraph({
  children,
  className,
}: ArticleParagraphProps) {
  return <p className={cn(articleBody, className)}>{children}</p>;
}

type ArticleSubsectionProps = {
  title: string;
  children: React.ReactNode;
};

export function ArticleSubsection({ title, children }: ArticleSubsectionProps) {
  return (
    <div className='article-subsection'>
      <h3 className={articleSubheading}>{title}</h3>
      <div className='mt-4 space-y-5'>{children}</div>
    </div>
  );
}

type ArticleGalleryProps = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleGallery({ children, className }: ArticleGalleryProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-[var(--article-gallery-bg)] p-6 sm:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

type ArticleGalleryRowProps = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleGalleryRow({ children, className }: ArticleGalleryRowProps) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-6 border-b border-[var(--article-gallery-divider)] py-5 first:pt-0 last:border-0 last:pb-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

type ArticleGalleryGridProps = {
  children: React.ReactNode;
  columns?: number;
  className?: string;
};

export function ArticleGalleryGrid({
  children,
  columns = 4,
  className,
}: ArticleGalleryGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-6 gap-y-8',
        columns >= 4 && 'sm:grid-cols-4',
        columns === 3 && 'sm:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

