import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

const CONTENT_DIR = path.join(process.cwd(), 'content/playground');

export type PlaygroundFrontmatter = {
  title: string;
  summary: string;
  order: number;
};

export type PlaygroundOutlineItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type PlaygroundProject = {
  slug: string;
  frontmatter: PlaygroundFrontmatter;
  outline: PlaygroundOutlineItem[];
};

function readProjectFile(slug: string) {
  return fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
}

/**
 * Headings are parsed with a regex rather than a full remark AST pass:
 * project files are short, hand-authored articles, so this stays cheap and
 * dependency-light. Slugs use the same `github-slugger` rehype-slug relies
 * on internally, so ids always match between the outline and the rendered
 * headings.
 */
function extractOutline(source: string): PlaygroundOutlineItem[] {
  const slugger = new GithubSlugger();
  const headingPattern = /^(##|###)\s+(.+)$/gm;
  const outline: PlaygroundOutlineItem[] = [];

  for (const match of source.matchAll(headingPattern)) {
    const depth = match[1].length === 2 ? 2 : 3;
    const text = match[2].trim();
    outline.push({ id: slugger.slug(text), text, depth });
  }

  return outline;
}

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getProjectSource(slug: string): string {
  const raw = readProjectFile(slug);
  const { content } = matter(raw);
  return content;
}

export function getProject(slug: string): PlaygroundProject {
  const raw = readProjectFile(slug);
  const { content, data } = matter(raw);
  return {
    slug,
    frontmatter: data as PlaygroundFrontmatter,
    outline: extractOutline(content),
  };
}

export function getAllProjects(): PlaygroundProject[] {
  return getProjectSlugs()
    .map((slug) => getProject(slug))
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}
