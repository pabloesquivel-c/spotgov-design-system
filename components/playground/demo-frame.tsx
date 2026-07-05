'use client';

import * as React from 'react';
import { RiRestartLine } from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import { ExampleContainer } from '@/components/playground/example-container';

export type DemoVariant = {
  label: string;
  content: React.ReactNode;
};

type DemoFrameProps = {
  /** Variant toggles for showing different states/props of a component. */
  variants?: DemoVariant[];
  /** Shows a replay button that remounts the demo to restart an animation. */
  replay?: boolean;
  /** Used when there's a single static demo with no variants. */
  children?: React.ReactNode;
};

/**
 * v1's interactive presentation container. Deliberately simple: authors pass
 * hand-picked variants or a replay flag rather than this component
 * auto-discovering a component's full prop matrix.
 */
export function DemoFrame({ variants, replay, children }: DemoFrameProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [replayKey, setReplayKey] = React.useState(0);

  const content = variants ? variants[activeIndex].content : children;

  return (
    <ExampleContainer>
      <div key={replayKey} className='flex w-full items-center justify-center'>
        {content}
      </div>
      {(variants || replay) && (
        <div className='flex items-center gap-3'>
          {variants && (
            <div className='flex items-center gap-1 rounded-lg bg-bg-white-0 p-1 ring-1 ring-inset ring-stroke-soft-200'>
              {variants.map((variant, index) => (
                <button
                  key={variant.label}
                  type='button'
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-label-sm transition-colors',
                    index === activeIndex
                      ? 'bg-bg-weak-50 text-text-strong-950'
                      : 'text-text-sub-600 hover:text-text-strong-950',
                  )}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          )}
          {replay && (
            <Button.Root
              variant='neutral'
              mode='ghost'
              size='xsmall'
              onClick={() => setReplayKey((key) => key + 1)}
            >
              <Button.Icon as={RiRestartLine} />
              Replay
            </Button.Root>
          )}
        </div>
      )}
    </ExampleContainer>
  );
}
