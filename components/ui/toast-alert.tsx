import * as React from 'react';
import {
  RiAlertLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiSparklingLine,
} from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import { toast } from '@/components/ui/toast';

type AlertToastProps = {
  t: string | number;
  status?: React.ComponentPropsWithoutRef<typeof Alert.Root>['status'];
  variant?: React.ComponentPropsWithoutRef<typeof Alert.Root>['variant'];
  size?: React.ComponentPropsWithoutRef<typeof Alert.Root>['size'];
  message: string;
  dismissable?: boolean;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
};

const AlertToast = React.forwardRef<
  React.ComponentRef<typeof Alert.Root>,
  AlertToastProps
>(
  (
    {
      t,
      status = 'feature',
      variant = 'stroke',
      size = 'small',
      message,
      dismissable = true,
      icon,
      action,
    },
    forwardedRef,
  ) => {
    let Icon: React.ElementType;

    if (icon) {
      Icon = icon;
    } else {
      switch (status) {
        case 'success':
          Icon = RiCheckboxCircleLine;
          break;
        case 'warning':
          Icon = RiAlertLine;
          break;
        case 'error':
          Icon = RiErrorWarningLine;
          break;
        case 'information':
          Icon = RiInformationLine;
          break;
        case 'feature':
          Icon = RiSparklingLine;
          break;
        default:
          Icon = RiErrorWarningLine;
          break;
      }
    }

    return (
      <Alert.Root
        ref={forwardedRef}
        status={status}
        variant={variant}
        size={size}
        className='w-[360px]'
      >
        <Alert.Icon as={Icon} />
        {message}
        {action ? (
          <button
            type='button'
            className='shrink-0 whitespace-nowrap font-medium underline'
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ) : null}
        {dismissable ? (
          <button type='button' onClick={() => toast.dismiss(t)}>
            <Alert.CloseIcon />
          </button>
        ) : null}
      </Alert.Root>
    );
  },
);
AlertToast.displayName = 'AlertToast';

export { AlertToast as Root };
