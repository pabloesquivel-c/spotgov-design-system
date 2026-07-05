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
        This is the way I want the playground to be structured: in a way
        that it reads like an article and it&apos;s incredibly minimal and
        beautifully designed. Inter font, 400 weight, subtle headers to
        divide sections.
      </p>
      <p className={articleBody}>
        The tokens come from AlignUI, adapted for a restrained product feel.
        One brand blue, neutral surfaces, and a small set of status colors.
        Nothing extra.
      </p>

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
