import figma from '@figma/code-connect/react';

import * as Input from './input';

// Figma: Text Input [1.1]
// componentKey: 04ea634a1ebce022c42d58bcd2571e417716e264
figma.connect(
  Input.Root,
  'https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=REPLACE_ME',
  {
    props: {
      size: figma.enum('Size', {
        Medium: 'medium',
        Small: 'small',
        'X-Small': 'xsmall',
      }),
      hasError: figma.boolean('Error'),
      placeholder: figma.string('Placeholder'),
    },
    example: ({ size, hasError, placeholder }) => (
      <Input.Root size={size} hasError={hasError}>
        <Input.Wrapper>
          <Input.Input placeholder={placeholder} />
        </Input.Wrapper>
      </Input.Root>
    ),
  },
);
