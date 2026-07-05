'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

/**
 * Minimal one-shot entrance animation used to exercise DemoFrame's replay
 * button, standing in for real motion demos until a project actually needs
 * one. Remounting (via DemoFrame's replay key) restarts the transition.
 */
export function PulseDemo() {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        'size-16 rounded-full bg-primary-base transition-all duration-500 ease-out',
        entered ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
      )}
    />
  );
}
