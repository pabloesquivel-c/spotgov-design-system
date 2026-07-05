import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import {
  getProject,
  getProjectSlugs,
  getProjectSource,
} from '@/lib/playground';
import { ArticleShell } from '@/components/playground/article-shell';
import { playgroundMdxComponents } from '@/components/playground/mdx-components';
import { articleH1, articleBody } from '@/components/playground/typography';

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ project: slug }));
}

export default function PlaygroundProjectPage({
  params,
}: {
  params: { project: string };
}) {
  const slugs = new Set(getProjectSlugs());
  if (!slugs.has(params.project)) {
    notFound();
  }

  const project = getProject(params.project);
  const source = getProjectSource(params.project);

  return (
    <ArticleShell>
      <h1 className={articleH1}>{project.frontmatter.title}</h1>
      <p className={articleBody}>{project.frontmatter.summary}</p>
      <MDXRemote
        source={source}
        components={playgroundMdxComponents}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeSlug],
          },
          // Content lives in content/playground/*.mdx, committed to this
          // repo, not user-submitted at runtime, so it's safe to allow the
          // JSX expressions (e.g. `variants={[...]}`) demos rely on.
          blockJS: false,
        }}
      />
    </ArticleShell>
  );
}
