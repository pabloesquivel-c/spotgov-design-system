'use client';

import * as React from 'react';

import * as SegmentedControl from '@/components/ui/segmented-control';
import { cn } from '@/utils/cn';

const LOGICAL_WIDTH = 1440;
const LOGICAL_HEIGHT = 900;

type DisplayMode = 'fit' | 'actual';

export function DesktopReferenceFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = React.useState(LOGICAL_WIDTH);
  const [mode, setMode] = React.useState<DisplayMode>('fit');

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => setAvailableWidth(viewport.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const scale =
    mode === 'fit' ? Math.min(1, availableWidth / LOGICAL_WIDTH) : 1;

  return (
    <section
      aria-label={`${label} desktop reference`}
      className='w-full overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'
    >
      <div className='flex items-center justify-between gap-4 border-b border-stroke-soft-200 px-4 py-3'>
        <div className='min-w-0'>
          <p className='truncate text-label-sm text-text-strong-950'>{label}</p>
          <p className='text-paragraph-xs text-text-sub-600'>
            Logical canvas: 1440 x 900
          </p>
        </div>

        <SegmentedControl.Root
          value={mode}
          onValueChange={(value) => setMode(value as DisplayMode)}
          className='w-40 shrink-0'
        >
          <SegmentedControl.List aria-label='Reference display size'>
            <SegmentedControl.Trigger value='fit' className='text-text-sub-600'>
              Fit
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger
              value='actual'
              className='text-text-sub-600'
            >
              100%
            </SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>
      </div>

      <div
        ref={viewportRef}
        className={cn(
          'w-full bg-bg-soft-200',
          mode === 'actual' ? 'overflow-auto' : 'overflow-hidden',
        )}
      >
        <div
          style={{
            width: mode === 'fit' ? LOGICAL_WIDTH * scale : LOGICAL_WIDTH,
            height: mode === 'fit' ? LOGICAL_HEIGHT * scale : LOGICAL_HEIGHT,
          }}
        >
          <div
            style={{
              width: LOGICAL_WIDTH,
              height: LOGICAL_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
