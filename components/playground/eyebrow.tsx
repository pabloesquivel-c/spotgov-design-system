import { cn } from '@/utils/cn';
import { articleEyebrow } from '@/components/playground/typography';

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn(articleEyebrow, className)}>{children}</p>;
}
