import figma from '@figma/code-connect/react';

import * as Banner from './banner';

// Figma: Banner [1.1]
figma.connect(
  Banner.Root,
  'https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=REPLACE_ME',
  {
    props: {
      variant: figma.enum('Style', {
        Filled: 'filled',
        Light: 'light',
        Lighter: 'lighter',
        Stroke: 'stroke',
      }),
      status: figma.enum('Status', {
        Error: 'error',
        Warning: 'warning',
        Success: 'success',
        Information: 'information',
        Feature: 'feature',
      }),
      label: figma.string('Label'),
    },
    example: ({ variant, status, label }) => (
      <Banner.Root variant={variant} status={status}>
        <Banner.Content>{label}</Banner.Content>
      </Banner.Root>
    ),
  },
);
