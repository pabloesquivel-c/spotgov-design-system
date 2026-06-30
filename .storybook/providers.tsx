'use client';

import { ThemeProvider } from 'next-themes';
import { Provider as TooltipProvider } from '@/components/ui/tooltip';

export function StorybookProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
      <TooltipProvider>
        <div className='bg-bg-white-0 font-sans text-text-strong-950 antialiased'>
          {children}
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
