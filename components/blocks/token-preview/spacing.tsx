import { Section } from './section';

const denseSteps = [
  { label: '4px', utility: 'gap-1 / p-1', className: 'gap-1' },
  { label: '8px', utility: 'gap-2 / p-2', className: 'gap-2' },
  { label: '12px', utility: 'gap-3 / p-3', className: 'gap-3' },
  { label: '16px', utility: 'gap-4 / p-4', className: 'gap-4' },
] as const;

const breathableSteps = [
  { label: '8px', utility: 'gap-2', className: 'gap-2' },
  { label: '16px', utility: 'gap-4', className: 'gap-4' },
  { label: '24px', utility: 'gap-6', className: 'gap-6' },
  { label: '32px', utility: 'gap-8', className: 'gap-8' },
] as const;

function SpacingRow({
  label,
  utility,
  className,
}: {
  label: string;
  utility: string;
  className: string;
}) {
  return (
    <div className='flex items-center gap-4'>
      <div className={`flex ${className}`}>
        <div className='size-6 rounded bg-primary-alpha-16 ring-1 ring-primary-alpha-24' />
        <div className='size-6 rounded bg-primary-alpha-16 ring-1 ring-primary-alpha-24' />
        <div className='size-6 rounded bg-primary-alpha-16 ring-1 ring-primary-alpha-24' />
      </div>
      <div>
        <p className='text-label-sm text-text-strong-950'>{label}</p>
        <p className='text-paragraph-xs text-text-soft-400'>{utility}</p>
      </div>
    </div>
  );
}

export function SpacingSection() {
  return (
    <>
      <Section
        title='Spacing — dense (4px rhythm)'
        description='Tables, toolbars, menus, inline controls. Step by 4px, cap at 16px.'
      >
        <div className='flex flex-col gap-4'>
          {denseSteps.map((step) => (
            <SpacingRow key={step.label} {...step} />
          ))}
        </div>
      </Section>

      <Section
        title='Spacing — breathable (8px rhythm)'
        description='Cards, sections, widgets. Defaults: gap-6 (24px) between widgets, gap-8 (32px) between sections, p-6 (24px) card padding.'
      >
        <div className='flex flex-col gap-4'>
          {breathableSteps.map((step) => (
            <SpacingRow key={`b-${step.label}`} {...step} />
          ))}
        </div>
      </Section>
    </>
  );
}
