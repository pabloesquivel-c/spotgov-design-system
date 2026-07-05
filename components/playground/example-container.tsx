import { cn } from '@/utils/cn';
import { articleExampleContainer } from '@/components/playground/typography';

/**
 * The gray "presentation surface" used any time the article shows something
 * concrete instead of prose: a palette, code, a static screenshot, or a live
 * DemoFrame. Height is always auto so it adapts to whatever it holds.
 */
export function ExampleContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(articleExampleContainer, className)}>{children}</div>
  );
}
