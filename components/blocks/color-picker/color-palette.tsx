'use client';

import { RiCheckLine } from '@remixicon/react';

type ColorPaletteProps = {
  colors: string[];
  selectedHex: string;
  onColorSelect: (colorHex: string) => void;
  variant?: 'check' | 'ring';
  size?: 'sm' | 'md';
  gap?: 'sm' | 'md';
};

function ColorSwatchButton({
  colorHex,
  selectedHex,
  onSelect,
  variant,
  size,
}: {
  colorHex: string;
  selectedHex: string;
  onSelect: (colorHex: string) => void;
  variant: 'check' | 'ring';
  size: 'sm' | 'md';
}) {
  const isSelected = selectedHex.toUpperCase() === colorHex.toUpperCase();
  const isWhite = colorHex.toUpperCase() === '#FFFFFF';
  const dimension = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';

  return (
    <button
      type='button'
      className={`relative ${dimension}`}
      onClick={() => onSelect(colorHex)}
    >
      <div
        className={`absolute inset-0 rounded-full ${isWhite ? 'border border-stroke-soft-200' : ''}`}
        style={{ backgroundColor: colorHex }}
      />

      {isSelected && variant === 'check' && (
        <>
          <div className='absolute -inset-1.5'>
            <div className='absolute inset-0 rounded-full border-[3px] border-stroke-white-0' />
            <div className='absolute inset-[3px] rounded-full border border-stroke-soft-200' />
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <RiCheckLine
              className={`size-5 ${
                isWhite ? 'text-text-disabled-300' : 'text-text-white-0'
              }`}
            />
          </div>
        </>
      )}

      {isSelected && variant === 'ring' && (
        <>
          <div className='absolute -inset-[5px]'>
            <div className='absolute inset-0 rounded-full border-stroke-white-0' />
          </div>
          <div className='absolute -inset-[5px]'>
            <div className='absolute inset-0 rounded-full border-2 border-primary-alpha-16' />
          </div>
        </>
      )}
    </button>
  );
}

export function ColorPalette({
  colors,
  selectedHex,
  onColorSelect,
  variant = 'check',
  size = 'md',
  gap = 'md',
}: ColorPaletteProps) {
  return (
    <div className={gap === 'sm' ? 'flex gap-2.5' : 'flex gap-3'}>
      {colors.map((colorHex) => (
        <ColorSwatchButton
          key={colorHex}
          colorHex={colorHex}
          selectedHex={selectedHex}
          onSelect={onColorSelect}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  );
}

export const GRAYSCALE_COLORS = [
  '#FFFFFF',
  '#EBEBEB',
  '#D1D1D1',
  '#A3A3A3',
  '#5C5C5C',
  '#333333',
];

export const GRAYSCALE_COLORS_EXTENDED = [
  '#FFFFFF',
  '#F5F5F5',
  '#EBEBEB',
  '#D1D1D1',
  '#A3A3A3',
  '#7B7B7B',
  '#5C5C5C',
  '#333333',
];

export const THEME_COLORS = ['#335CFF', '#47C2FF', '#7D52F4', '#F6B51E', '#FB4BA3'];

export const BLUE_COLORS = ['#D5E2FF', '#97BAFF', '#335CFF', '#2547D0', '#182F8B'];
