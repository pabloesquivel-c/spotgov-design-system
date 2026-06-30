import { cn } from '@/utils/cn';

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, description, children, className }: SectionProps) {
  return (
    <section className={cn('py-10', className)}>
      <div className='mb-6'>
        <h2 className='text-label-md text-text-strong-950'>{title}</h2>
        {description ? (
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
