import { getAllProjects } from '@/lib/playground';
import { PlaygroundNav } from '@/components/playground/playground-nav';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = getAllProjects().map((project) => ({
    slug: project.slug,
    title: project.frontmatter.title,
    outline: project.outline,
  }));

  return (
    <div className='flex min-h-screen w-full flex-col bg-bg-white-0'>
      <PlaygroundNav projects={projects} />
      {children}
    </div>
  );
}
