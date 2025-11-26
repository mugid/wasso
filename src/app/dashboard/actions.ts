"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { selectProjects, insertProject } from "@/server/queries";


export async function getProjects() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }

    const allProjects = await selectProjects({ userId: session.user.id });
    
    return allProjects;
}

export async function createProject(name: string, description: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }

    await insertProject({ name, description, userId: session.user.id });
}