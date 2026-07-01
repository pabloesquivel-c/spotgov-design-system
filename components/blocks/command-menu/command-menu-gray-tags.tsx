'use client';

import * as Tag from '@/components/ui/tag';

const DEFAULT_TAGS = ['People', 'Files', 'Emails', 'Actions'];

export function CommandMenuGrayTags({
  tags = DEFAULT_TAGS,
}: {
  tags?: string[];
}) {
  return (
    <div className='px-5 py-4'>
      <div className='mb-3 text-label-xs text-text-sub-600'>
        What are you looking for?
      </div>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Tag.Root key={tag} variant='gray'>
            {tag}
            <Tag.DismissButton type='button' />
          </Tag.Root>
        ))}
      </div>
    </div>
  );
}
