import { Section } from './section';

const radiusSamples = [
  {
    name: 'Micro',
    utility: 'rounded-lg',
    cssVar: '--radius-sm',
    value: '8px',
    usage: 'Tags, badges, micro chips only',
  },
  {
    name: 'Default',
    utility: 'rounded-10',
    cssVar: '--radius',
    value: '12px',
    usage: 'Buttons, inputs, selects, nav, dropdown rows',
  },
  {
    name: 'Surface',
    utility: 'rounded-sg-lg',
    cssVar: '--radius-lg',
    value: '16px',
    usage: 'Cards, KPI widgets, alert bodies, AI blocks',
  },
  {
    name: 'Overlay',
    utility: 'rounded-20',
    cssVar: '—',
    value: '20px',
    usage: 'Modals, popovers, command menu',
  },
] as const;

export function RadiusSection() {
  return (
    <Section
      title='Radius'
      description='12–16px product band. Soft containers, flat data — round the workspace, not every cell.'
    >
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {radiusSamples.map((item) => (
          <div key={item.name} className='flex flex-col gap-2'>
            <div
              className='flex h-20 w-full items-center justify-center bg-bg-weak-50 ring-1 ring-inset ring-stroke-soft-200'
              style={{
                borderRadius:
                  item.cssVar === '—' ? '1.25rem' : `var(${item.cssVar})`,
              }}
            >
              <span className='text-label-xs text-text-sub-600'>
                {item.value}
              </span>
            </div>
            <div>
              <p className='text-label-xs text-text-strong-950'>{item.name}</p>
              <p className='text-paragraph-xs text-text-soft-400'>
                {item.utility}
              </p>
              <p className='mt-0.5 text-paragraph-xs text-text-sub-600'>
                {item.usage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
