export function DashedDivider() {
  return (
    <div className='relative h-0 w-full text-stroke-soft-200' role='separator'>
      <div
        className='absolute left-0 h-px w-full'
        style={{
          background:
            'linear-gradient(90deg, currentColor 4px, transparent 4px) 50% 50% / 8px 1px repeat no-repeat',
        }}
      />
    </div>
  );
}
