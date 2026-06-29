import { Section } from './section';

const typeSamples = [
  {
    token: 'Hero',
    utility: 'text-sg-hero',
    spec: '24px / 500',
    sample: 'Discover government contracts',
  },
  {
    token: 'Page title',
    utility: 'text-sg-page-title',
    spec: '20px / 500',
    sample: 'Procurement dashboard',
  },
  {
    token: 'Section heading',
    utility: 'text-sg-section',
    spec: '16px / 500',
    sample: 'Active opportunities',
  },
  {
    token: 'Label / emphasis',
    utility: 'text-sg-label',
    spec: '14px / 500',
    sample: 'Contract status',
  },
  {
    token: 'Body text',
    utility: 'text-sg-body',
    spec: '14px / 400',
    sample:
      'SpotGov helps teams find, track, and win government contracts with clarity and speed.',
  },
  {
    token: 'Small label',
    utility: 'text-sg-small-label',
    spec: '12px / 500',
    sample: 'Filter by agency',
  },
  {
    token: 'Metadata',
    utility: 'text-sg-metadata',
    spec: '12px / 400',
    sample: 'Updated 2 hours ago · Inter Variable',
  },
] as const;

export function TypographySection() {
  return (
    <Section
      title='Typography'
      description='Inter Variable type scale for SpotGov product UI.'
    >
      <div className='flex flex-col gap-6'>
        {typeSamples.map((item) => (
          <div
            key={item.token}
            className='grid gap-2 border-b border-stroke-soft-200 pb-6 last:border-0 last:pb-0 md:grid-cols-[140px_1fr]'
          >
            <div>
              <p className='text-sg-small-label text-text-strong-950'>
                {item.token}
              </p>
              <p className='font-mono text-sg-metadata text-text-soft-400'>
                {item.spec}
              </p>
            </div>
            <p className={`${item.utility} text-text-strong-950`}>
              {item.sample}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
