// AlignUI Toast v0.0.0

import * as React from 'react';
import { toast as sonnerToast, Toaster, type ExternalToast } from 'sonner';

const defaultOptions: ExternalToast = {
  className: 'group/toast',
  position: 'bottom-right',
};

const customToast = (
  renderFunc: (t: string | number) => React.ReactElement,
  // ExternalToast, not ToasterProps — this is per-toast data (id, duration,
  // position, ...) forwarded straight to sonnerToast.custom below, not
  // Toaster-wide config. The previous ToasterProps annotation happened to
  // typecheck for the fields already used here (position, className,
  // duration) but silently rejected `id`, the one option that matters for
  // de-duping a toast a user can re-trigger (e.g. Export) instead of
  // stacking copies.
  options: ExternalToast = {},
) => {
  const mergedOptions = { ...defaultOptions, ...options };
  return sonnerToast.custom(renderFunc, mergedOptions);
};

const toast = {
  ...sonnerToast,
  custom: customToast,
};

export { toast, Toaster };
