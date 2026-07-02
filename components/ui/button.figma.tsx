import figma from '@figma/code-connect/react';

import * as Button from './button';

// Figma: Buttons [1.1]
// componentKey: 196a29c0924360b8486b10079aef5a7b0ba7672a
// Replace node-id after copying link from Figma (Right-click component set → Copy link)
figma.connect(
  Button.Root,
  'https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=REPLACE_ME',
  {
    props: {
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Neutral: 'neutral',
        Error: 'error',
      }),
      mode: figma.enum('Style', {
        Filled: 'filled',
        Stroke: 'stroke',
        Lighter: 'lighter',
        Ghost: 'ghost',
      }),
      size: figma.enum('Size', {
        Medium: 'medium',
        Small: 'small',
        'X-Small': 'xsmall',
        '2X-Small': 'xxsmall',
      }),
      disabled: figma.boolean('Disabled'),
      loading: figma.boolean('Loading'),
      label: figma.string('Label'),
    },
    example: ({ variant, mode, size, disabled, loading, label }) => (
      <Button.Root
        variant={variant}
        mode={mode}
        size={size}
        disabled={disabled}
        loading={loading}
      >
        {label}
      </Button.Root>
    ),
  },
);
