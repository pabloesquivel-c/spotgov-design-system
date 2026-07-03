import * as Button from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-weak-50 px-6 text-center'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-title-h4 text-text-strong-950'>
          SpotGov Design System
        </h1>
        <p className='max-w-md text-paragraph-md text-text-sub-600'>
          Built on AlignUI. Browse the full component catalog, primitives, and
          blocks in Storybook.
        </p>
      </div>
      <Button.Root asChild variant='primary' mode='filled' size='medium'>
        <a href='/storybook/'>Open Storybook</a>
      </Button.Root>
    </div>
  );
}
