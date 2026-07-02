'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';
import {
  SVGStarFill,
  SVGStarHalf,
  SVGStarLine,
} from '@/components/ui/svg-rating-icons';

export type RatingDisplayProps = {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md';
};

function getStarIcon(value: number, index: number, sizeClass: string) {
  if (value >= index + 1) {
    return <SVGStarFill className={cn(sizeClass, 'text-warning-base')} />;
  }

  if (value >= index + 0.5) {
    return <SVGStarHalf className={cn(sizeClass, 'text-warning-base')} />;
  }

  return <SVGStarLine className={cn(sizeClass, 'text-stroke-sub-300')} />;
}

export function RatingDisplay({
  value,
  max = 5,
  className,
  size = 'md',
}: RatingDisplayProps) {
  const sizeClass = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <div
      className={cn('flex gap-0.5', className)}
      role='img'
      aria-label={`${value} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => (
        <span key={index} aria-hidden>
          {getStarIcon(value, index, sizeClass)}
        </span>
      ))}
    </div>
  );
}

export type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
};

export function RatingInput({
  value,
  onChange,
  max = 5,
  className,
  disabled = false,
  label = 'Rating',
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div
      className={cn('flex gap-0.5', className)}
      role='radiogroup'
      aria-label={label}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isActive = displayValue >= starValue;

        return (
          <button
            key={starValue}
            type='button'
            role='radio'
            aria-checked={value === starValue}
            aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
            disabled={disabled}
            className={cn(
              'rounded-8 outline-none transition duration-200 ease-out',
              'focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
            onMouseEnter={() => setHoverValue(starValue)}
            onFocus={() => setHoverValue(starValue)}
            onBlur={() => setHoverValue(null)}
            onClick={() => onChange(starValue)}
          >
            {isActive ? (
              <SVGStarFill className='size-5 text-warning-base' />
            ) : (
              <SVGStarLine className='size-5 text-stroke-sub-300' />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { StarRating } from '@/components/ui/svg-rating-icons';
