// AlignUI Drawer v0.0.0

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { RiCloseLine } from '@remixicon/react';

import * as CompactButton from '@/components/ui/compact-button';
import { cn } from '@/utils/cn';

const DrawerRoot = DialogPrimitive.Root;
DrawerRoot.displayName = 'Drawer';

const DrawerTrigger = DialogPrimitive.Trigger;
DrawerTrigger.displayName = 'DrawerTrigger';

const DrawerClose = DialogPrimitive.Close;
DrawerClose.displayName = 'DrawerClose';

const DrawerPortal = DialogPrimitive.Portal;
DrawerPortal.displayName = 'DrawerPortal';

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <DialogPrimitive.Overlay
      ref={forwardedRef}
      className={cn(
        // base
        'fixed inset-0 z-50 grid grid-cols-1 place-items-end overflow-hidden bg-overlay backdrop-blur-[10px]',
        // animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=open]:duration-200 data-[state=open]:ease-out',
        'data-[state=closed]:duration-150 data-[state=closed]:ease-out',
        className,
      )}
      {...rest}
    />
  );
});
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** Reaches the internal DrawerOverlay this component renders. */
    overlayClassName?: string;
    /**
     * Skips the built-in slide/fade classes so a consumer can render its own
     * animated element in their place (typically via `asChild` + a
     * `motion.div`, combined with `forceMount` so Motion's exit animation
     * gets to play before Radix removes the node). Default false: every
     * existing consumer is unaffected.
     */
    disableDefaultAnimation?: boolean;
  }
>(
  (
    {
      className,
      children,
      overlayClassName,
      disableDefaultAnimation = false,
      ...rest
    },
    forwardedRef,
  ) => {
    return (
      <DrawerPortal>
        {/*
          The overlay keeps its own default CSS fade regardless of
          disableDefaultAnimation — that flag only concerns Content, which is
          the piece a consumer replaces with a Motion-driven element. The
          overlay is a flat backdrop; a plain CSS fade is all it needs, so
          overlayClassName only restyles it (colour/blur), it doesn't retime it.
        */}
        <DrawerOverlay className={overlayClassName}>
          <DialogPrimitive.Content
            ref={forwardedRef}
            className={cn(
              // With disableDefaultAnimation + asChild, Content renders no
              // DOM node of its own — Radix's Slot clones these props onto
              // the consumer's element via plain class-string concatenation,
              // not tailwind-merge. Any class asserted here (base layout
              // included) would sit alongside the consumer's own classes with
              // no deduplication, and whichever wins is down to Tailwind's
              // generated stylesheet order, not intent. So in that mode
              // Content contributes nothing visual at all — the consumer's
              // element owns 100% of its own appearance.
              !disableDefaultAnimation && [
                // base
                'size-full max-w-[400px] overflow-y-auto',
                'border-l border-stroke-soft-200 bg-bg-white-0',
                // animation
                // Exit is faster than enter and never ease-in: ease-in
                // delays the initial movement, which is the exact moment a
                // closing panel is being watched most closely.
                'data-[state=open]:duration-200 data-[state=open]:ease-out data-[state=open]:animate-in',
                'data-[state=closed]:duration-150 data-[state=closed]:ease-out data-[state=closed]:animate-out',
                'data-[state=open]:slide-in-from-right-full',
                'data-[state=closed]:slide-out-to-right-full',
              ],
              className,
            )}
            {...rest}
          >
            {disableDefaultAnimation ? (
              children
            ) : (
              <div className='relative flex size-full flex-col'>
                {children}
              </div>
            )}
          </DialogPrimitive.Content>
        </DrawerOverlay>
      </DrawerPortal>
    );
  },
);
DrawerContent.displayName = 'DrawerContent';

function DrawerHeader({
  className,
  children,
  showCloseButton = true,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-stroke-soft-200 p-5',
        className,
      )}
      {...rest}
    >
      {children}

      {showCloseButton && (
        <DrawerClose asChild>
          <CompactButton.Root variant='ghost' size='large'>
            <CompactButton.Icon as={RiCloseLine} />
          </CompactButton.Root>
        </DrawerClose>
      )}
    </div>
  );
}
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <DialogPrimitive.Title
      ref={forwardedRef}
      className={cn('flex-1 text-label-lg text-text-strong-950', className)}
      {...rest}
    />
  );
});
DrawerTitle.displayName = 'DrawerTitle';

function DrawerBody({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-1', className)} {...rest}>
      {children}
    </div>
  );
}
DrawerBody.displayName = 'DrawerBody';

function DrawerFooter({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 border-stroke-soft-200 p-5',
        className,
      )}
      {...rest}
    />
  );
}
DrawerFooter.displayName = 'DrawerFooter';

export {
  DrawerRoot as Root,
  DrawerTrigger as Trigger,
  DrawerClose as Close,
  DrawerContent as Content,
  DrawerHeader as Header,
  DrawerTitle as Title,
  DrawerBody as Body,
  DrawerFooter as Footer,
};
