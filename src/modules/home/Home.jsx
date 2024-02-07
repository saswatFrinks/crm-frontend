import Heading from '@/shared/layouts/main/heading';
import Project from '@/shared/ui/ProjectCard';

export default function Home() {
  return (
    <>
      <Heading>Project</Heading>
      <div className="flex  flex-wrap gap-6 p-6">
        <Project.Create />

        {Array(10)
          .fill(1)
          .map((t, i) => (
            <Project.Card key={i} />
          ))}
      </div>
    </>
  );
}
