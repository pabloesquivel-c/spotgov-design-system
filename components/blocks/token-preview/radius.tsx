import { Section } from './section';

const radiusSamples = [
  { name: 'sm', cssVar: '--radius-sm', value: '8px' },
  { name: 'default', cssVar: '--radius', value: '12px' },
  { name: 'lg', cssVar: '--radius-lg', value: '16px' },
  { name: 'full', cssVar: '--radius-full', value: '9999px' },
] as const;

export function RadiusSection() {
  return (
    <Section
      title='Radius'
      description='Corner radii for buttons, inputs, cards, and tags.'
    >
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {radiusSamples.map((item) => (
          <div key={item.name} className='flex flex-col gap-2'>
            <div
              className='flex h-20 w-full items-center justify-center bg-bg-weak-50 ring-1 ring-inset ring-stroke-soft-200'
              style={{ borderRadius: `var(${item.cssVar})` }}
            >
              <span className='text-label-xs text-text-sub-600'>
                {item.value}
              </span>
            </div>
            <div>
              <p className='text-label-xs text-text-strong-950'>{item.name}</p>
              <p className='text-paragraph-xs text-text-soft-400'>
                {item.cssVar}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
