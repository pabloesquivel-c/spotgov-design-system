import figma from '@figma/code-connect/react';

import * as Badge from './badge';

// Figma: search "Badge [1.1]" in AlignUI library — confirm component set name
figma.connect(
  Badge.Root,
  'https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=REPLACE_ME',
  {
    props: {
      size: figma.enum('Size', {
        Small: 'small',
        Medium: 'medium',
      }),
      variant: figma.enum('Style', {
        Filled: 'filled',
        Light: 'light',
        Lighter: 'lighter',
        Stroke: 'stroke',
      }),
      color: figma.enum('Color', {
        Gray: 'gray',
        Blue: 'blue',
        Orange: 'orange',
        Red: 'red',
        Green: 'green',
        Yellow: 'yellow',
        Purple: 'purple',
        Sky: 'sky',
        Pink: 'pink',
        Teal: 'teal',
      }),
      disabled: figma.boolean('Disabled'),
      label: figma.string('Label'),
    },
    example: ({ size, variant, color, disabled, label }) => (
      <Badge.Root size={size} variant={variant} color={color} disabled={disabled}>
        {label}
      </Badge.Root>
    ),
  },
);
