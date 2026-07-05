import type { MDXComponents } from 'mdx/types';
import {
  Root as BadgeRoot,
  Icon as BadgeIcon,
  Dot as BadgeDot,
} from '@/components/ui/badge';
import { Eyebrow } from '@/components/playground/eyebrow';
import { ExampleContainer } from '@/components/playground/example-container';
import { SwatchGrid } from '@/components/playground/swatch-grid';
import { DemoFrame } from '@/components/playground/demo-frame';
import { PulseDemo } from '@/components/playground/demo-content/pulse-demo';
import { AppSidebar } from '@/components/blocks/sidebar/app-sidebar';
import {
  articleH2,
  articleH3,
  articleBody,
  articleDivider,
} from '@/components/playground/typography';

const Badge = { Root: BadgeRoot, Icon: BadgeIcon, Dot: BadgeDot };

/**
 * Section headings (##/###) get a centered divider above them, matching the
 * Paper "Playground Structure" mock. `rehype-slug` has already stamped an
 * `id` matching lib/playground.ts's outline extraction, so it arrives via
 * `...props` and must be spread onto the heading itself.
 */
function withSectionDivider(Tag: 'h2' | 'h3', headingClassName: string) {
  return function Heading(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <div>
        <div className={articleDivider} />
        <Tag className={headingClassName} {...props} />
      </div>
    );
  };
}

export const playgroundMdxComponents: MDXComponents = {
  h2: withSectionDivider('h2', articleH2),
  h3: withSectionDivider('h3', articleH3),
  p: (props) => <p className={articleBody} {...props} />,
  ul: (props) => (
    <ul className={`${articleBody} flex list-disc flex-col gap-2 pl-5`} {...props} />
  ),
  a: (props) => (
    <a className='text-primary-base underline underline-offset-2' {...props} />
  ),
  Eyebrow,
  ExampleContainer,
  SwatchGrid,
  DemoFrame,
  Badge,
  PulseDemo,
  AppSidebar,
};
