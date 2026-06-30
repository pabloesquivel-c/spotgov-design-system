import { Section } from './section';

const shadowSamples = [
  {
    name: 'shadow-regular-xs',
    utility: 'shadow-regular-xs',
    value: '0 1px 2px 0 #0a0d1408',
    usage: 'Inputs, selects, cards at rest, compact controls',
  },
  {
    name: 'shadow-regular-md',
    utility: 'shadow-regular-md',
    value: '0 16px 32px -12px #0e121b1a',
    usage: 'Dropdowns, modals, popovers, command menu',
  },
] as const;

export function ShadowsSection() {
  return (
    <Section
      title='Shadows'
      description='Two product shadows only — ring-first for resting surfaces, shadow for float. One shadow per element.'
    >
      <div className='grid gap-6 md:grid-cols-2'>
        {shadowSamples.map((item) => (
          <div key={item.name} className='flex flex-col gap-3'>
            <div
              className={`flex h-28 items-center justify-center rounded-sg-lg bg-bg-white-0 ring-1 ring-stroke-soft-200 ${item.utility}`}
            >
              <span className='text-label-xs text-text-sub-600'>Preview</span>
            </div>
            <div>
              <p className='text-label-sm text-text-strong-950'>{item.name}</p>
              <p className='mt-0.5 text-paragraph-xs text-text-soft-400'>
                {item.value}
              </p>
              <p className='mt-1 text-paragraph-xs text-text-sub-600'>
                {item.usage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
