import { Suspense } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { getProjects } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


async function ProjectsList() {
  const projects: Project[] = await getProjects();
  return (
    <>
      {projects.map((projects) => (
        <div
          key={projects.id}
          className="p-4 border-b hover:bg-accent/50 transition-colors"
        >
          <Link href={`/projectss/${projects.id}`} className="block">
            <h3 className="text-lg font-semibold hover:underline">
              {projects.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Created at: {projects.createdAt?.toLocaleDateString()}
            </p>
          </Link>
        </div>
      ))}
    </>
  );
}

export default async function Projects() {
  return (
    <div className="mt-20 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Your projects</h1>
        
      </div>

      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}
