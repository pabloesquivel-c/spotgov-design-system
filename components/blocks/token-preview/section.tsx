import { cn } from '@/utils/cn';

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, description, children, className }: SectionProps) {
  return (
    <section className={cn('border-b border-stroke-soft-200 py-12', className)}>
      <div className='mb-8'>
        <h2 className='text-sg-section text-text-strong-950'>{title}</h2>
        {description ? (
          <p className='mt-1 text-sg-body text-text-sub-600'>{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
