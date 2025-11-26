import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Project } from "@/types";

import { Folder, Pen, Search, Brush } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { ProjectForm } from "./projectsForm";
import { getProjects } from "../actions";

export async function DashboardSidebar() {
  const projects: Project[] = await getProjects();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Image src={"/logo.svg"} alt="logo" width={14} height={14} />       
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <SidebarMenuButton>
                      <Pen />
                      Create project
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>
                        Enter the details of the project you are starting.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="w-full max-w-md">
                      <ProjectForm />
                    </div>

                    <DialogFooter className="sm:justify-start"></DialogFooter>
                  </DialogContent>
                </Dialog>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Search />
                  Search
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Brush />
                  Create brief
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Suspense fallback={<Skeleton />}>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <Link href={`/dashboard/${project.id}`}>
                      <SidebarMenuButton>
                        <Folder /> {project.name}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </Suspense>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
