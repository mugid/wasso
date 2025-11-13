import { Suspense } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { getProjects } from "./actions";

async function ProjectsList() {
  const projects: Project[] = await getProjects();

  return (
    <>
      {projects.map((projects) => (
        <div key={projects.id} className="p-4 border-b hover:bg-accent/50 transition-colors">
          <Link href={`/projectss/${projects.id}`} className="block">
            <h3 className="text-lg font-semibold hover:underline">{projects.name}</h3>
            <p className="text-sm text-muted-foreground">
              Created at: {projects.createdAt?.toLocaleDateString()}
            </p>
          </Link>
        </div>
      ))}
    </>
  );
}

export default async function MindMaps() {
  return (
    <div className="px-10 pt-10 min-h-screen">
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}
