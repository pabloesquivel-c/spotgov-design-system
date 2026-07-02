import figma from '@figma/code-connect/react';

import * as StatusBadge from './status-badge';

// Figma: Status Badge [1.1]
// componentKey: bafd94858f3d0fca74ac21ed0e5024ea93909be6
figma.connect(
  StatusBadge.Root,
  'https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=REPLACE_ME',
  {
    props: {
      variant: figma.enum('Style', {
        Stroke: 'stroke',
        Light: 'light',
      }),
      status: figma.enum('Status', {
        Completed: 'completed',
        Pending: 'pending',
        Failed: 'failed',
        Disabled: 'disabled',
      }),
      label: figma.string('Label'),
    },
    example: ({ variant, status, label }) => (
      <StatusBadge.Root variant={variant} status={status}>
        <StatusBadge.Dot />
        {label}
      </StatusBadge.Root>
    ),
  },
);
