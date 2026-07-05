import { cn } from '@/utils/cn';

/**
 * Centered reading column shared by the playground index and every project
 * page. Width, padding, and spacing match the Paper "Playground Structure"
 * mock exactly (672px max width incl. 32px side padding, 64px vertical
 * padding, 608px content column). No flex gap here: every child controls
 * its own top margin (see components/playground/typography.ts) so the
 * mock's varied section rhythm can be reproduced precisely.
 */
export function ArticleShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        'mx-auto flex w-full max-w-[672px] flex-col px-8 py-16',
        className,
      )}
    >
      {children}
    </article>
  );
}
