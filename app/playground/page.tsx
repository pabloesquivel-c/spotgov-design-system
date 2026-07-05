import Link from 'next/link';
import { getAllProjects } from '@/lib/playground';
import { ArticleShell } from '@/components/playground/article-shell';
import {
  articleH1,
  articleH2,
  articleH3,
  articleBody,
  articleDivider,
} from '@/components/playground/typography';

export default function PlaygroundIndexPage() {
  const projects = getAllProjects();

  return (
    <ArticleShell>
      <h1 className={articleH1}>Welcome to Playground</h1>
      <p className={articleBody}>
        This is where SpotGov design work lives while it&apos;s in progress —
        sidebar explorations, new components, layout ideas. It&apos;s a
        visual reference, not a finished product: things here will change,
        sometimes a lot, before they ship.
      </p>
      <p className={articleBody}>
        Have feedback on something below? Send it to me directly in{' '}
        <span className='font-medium'>#spotgov-design</span> on Slack — a
        proper feedback workflow is coming, but for now that&apos;s the
        fastest way to reach me.
      </p>
      <p className={articleBody}>
        Looking for finished, production-ready components instead? Check{' '}
        <a
          href='/storybook'
          className='underline underline-offset-2 hover:text-text-strong-950'
        >
          Storybook
        </a>{' '}
        — that&apos;s the technical catalog. Playground is for seeing where
        things are headed; Storybook is what&apos;s actually built.
      </p>
      <p className={articleBody}>
        For engineers who want to run this locally: clone the repo, then
      </p>
      <pre className='rounded-md bg-bg-weak-50 px-4 py-3 text-[13px] leading-[22px] text-text-strong-950'>
        npm install{'\n'}npm run dev
      </pre>

      <div>
        <div className={articleDivider} />
        <h2 className={articleH2}>Projects</h2>
      </div>

      <ul className={`${articleBody} flex flex-col gap-8`}>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/playground/${project.slug}`}
              className='flex flex-col gap-1.5'
            >
              <span className={articleH3}>{project.frontmatter.title}</span>
              <span className='text-[14px] leading-[22px] text-[#57534D]'>
                {project.frontmatter.summary}
              </span>
            </Link>
          </li>
        ))}
        {projects.length === 0 && (
          <li className='text-[14px] leading-[22px] text-[#A6A09B]'>
            No projects yet. Add an .mdx file to content/playground.
          </li>
        )}
      </ul>
    </ArticleShell>
  );
}
