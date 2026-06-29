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
      <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
        {radiusSamples.map((item) => (
          <div key={item.name} className='flex flex-col items-center gap-3'>
            <div
              className='flex h-24 w-full items-center justify-center bg-primary-alpha-10 ring-1 ring-inset ring-stroke-soft-200'
              style={{ borderRadius: `var(${item.cssVar})` }}
            >
              <span className='text-sg-small-label text-primary-base'>
                {item.value}
              </span>
            </div>
            <div className='text-center'>
              <p className='text-sg-small-label text-text-strong-950'>
                {item.name}
              </p>
              <p className='font-mono text-sg-metadata text-text-soft-400'>
                {item.cssVar}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
