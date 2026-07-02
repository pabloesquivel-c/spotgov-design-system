import figma from '@figma/code-connect/react';

import * as Modal from './modal';

// Figma: Modal [1.1] — search AlignUI library for modal component set
figma.connect(
  Modal.Content,
  'https://www.figma.com/design/zTiVrKUV6Isp2fdWjl2dg3/AlignUI---Design-System-2.0--Current-?node-id=REPLACE_ME',
  {
    props: {
      title: figma.string('Title'),
      description: figma.string('Description'),
      showClose: figma.boolean('Show Close'),
    },
    example: ({ title, description, showClose }) => (
      <Modal.Root>
        <Modal.Content showClose={showClose}>
          <Modal.Header title={title} description={description} />
          <Modal.Body>Content</Modal.Body>
        </Modal.Content>
      </Modal.Root>
    ),
  },
);
