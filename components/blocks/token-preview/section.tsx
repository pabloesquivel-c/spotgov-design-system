import { cn } from '@/utils/cn';
import {
  ArticleParagraph,
  ArticleSection,
  articleSubheading,
} from './article';

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

/** @deprecated Use ArticleSection directly in new article-style sections. */
export function Section({ title, description, children, className, id }: SectionProps) {
  return (
    <ArticleSection id={id} title={title} className={className}>
      {description ? <ArticleParagraph>{description}</ArticleParagraph> : null}
      {children}
    </ArticleSection>
  );
}

export function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-4'>
      <h3 className={articleSubheading}>{title}</h3>
      {children}
    </div>
  );
}

export function TokenMeta({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <p className={cn('text-[14px] leading-5 text-text-soft-400', className)}>
      <span className='text-text-sub-600'>{label}</span> {value}
    </p>
  );
}
