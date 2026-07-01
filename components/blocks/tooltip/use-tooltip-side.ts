'use client';

import * as React from 'react';

export function useTooltipSide(): 'bottom' | 'right' {
  const [side, setSide] = React.useState<'bottom' | 'right'>('bottom');

  React.useEffect(() => {
    const updateSide = () => {
      setSide(window.innerWidth >= 768 ? 'right' : 'bottom');
    };

    updateSide();
    window.addEventListener('resize', updateSide);
    return () => window.removeEventListener('resize', updateSide);
  }, []);

  return side;
}
