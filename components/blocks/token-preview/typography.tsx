import { Section } from './section';

const typeSamples = [
  {
    token: 'Page title',
    utility: 'text-title-h6',
    spec: '20px / 500',
    sample: 'Procurement dashboard',
  },
  {
    token: 'Section heading',
    utility: 'text-label-md',
    spec: '16px / 500',
    sample: 'Active opportunities',
  },
  {
    token: 'Body',
    utility: 'text-paragraph-sm',
    spec: '14px / 400',
    sample:
      'SpotGov helps teams find, track, and win government contracts with clarity and speed.',
  },
  {
    token: 'Label',
    utility: 'text-label-sm',
    spec: '14px / 500',
    sample: 'Contract status',
  },
  {
    token: 'Caption',
    utility: 'text-paragraph-xs',
    spec: '12px / 400',
    sample: 'Updated 2 hours ago · Inter',
  },
  {
    token: 'Micro label',
    utility: 'text-label-xs',
    spec: '12px / 500',
    sample: 'Filter by agency',
  },
] as const;

export function TypographySection() {
  return (
    <Section
      title='Typography'
      description='Six AlignUI text styles for SpotGov product UI — locked Phase 2 scale.'
    >
      <div className='flex flex-col gap-5'>
        {typeSamples.map((item) => (
          <div
            key={item.token}
            className='grid gap-2 border-b border-stroke-soft-200 pb-5 last:border-0 last:pb-0 md:grid-cols-[160px_1fr]'
          >
            <div>
              <p className='text-label-xs text-text-strong-950'>{item.token}</p>
              <p className='text-paragraph-xs text-text-soft-400'>
                {item.utility} · {item.spec}
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
