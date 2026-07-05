'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import type { PlaygroundOutlineItem } from '@/lib/playground';

type NavProject = {
  slug: string;
  title: string;
  outline: PlaygroundOutlineItem[];
};

export function PlaygroundNav({ projects }: { projects: NavProject[] }) {
  const pathname = usePathname();
  const activeSlug = pathname?.startsWith('/playground/')
    ? pathname.replace('/playground/', '').split('/')[0]
    : null;
  const activeProject = projects.find((project) => project.slug === activeSlug);
  const [activeHeadingId, setActiveHeadingId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (!activeProject || activeProject.outline.length === 0) return;

    const headings = activeProject.outline
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveHeadingId(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [activeProject]);

  return (
    <nav
      aria-label='Playground navigation'
      className={cn(
        'group fixed left-8 top-16 z-10 hidden w-56 flex-col gap-6 lg:flex',
        'opacity-40 transition-opacity duration-300 ease-out',
        'hover:opacity-100 focus-within:opacity-100',
      )}
    >
      <Link
        href='/playground'
        className='text-label-sm text-text-sub-600 transition-colors hover:text-text-strong-950'
      >
        Playground
      </Link>

      <div className='flex flex-col gap-3'>
        <span className='text-label-xs uppercase tracking-wide text-text-soft-400'>
          Projects
        </span>
        <ul className='flex flex-col gap-3'>
          {projects.map((project) => {
            const isActive = project.slug === activeSlug;
            return (
              <li key={project.slug} className='flex flex-col gap-2'>
                <Link
                  href={`/playground/${project.slug}`}
                  className={cn(
                    'text-paragraph-sm transition-colors',
                    isActive
                      ? 'text-text-strong-950'
                      : 'text-text-sub-600 hover:text-text-strong-950',
                  )}
                >
                  {project.title}
                </Link>
                {isActive && project.outline.length > 0 && (
                  <ul className='flex flex-col gap-1.5 border-l border-stroke-soft-200 pl-3'>
                    {project.outline.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={cn(
                            'block text-paragraph-xs transition-colors',
                            item.depth === 3 && 'pl-3',
                            item.id === activeHeadingId
                              ? 'text-primary-base'
                              : 'text-text-soft-400 hover:text-text-strong-950',
                          )}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
