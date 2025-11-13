"use server";

import { mindmaps, mindmapNodes, projects} from "@/lib/db/schema";
import { flattenMindMapTree } from "@/lib/flattenTree";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { WordNode } from "@/types";

export async function insertMindMap({userInput, object, userId}: {userInput: string, object: WordNode, userId: string}) {
  const mapId = uuidv4();

  await db.insert(mindmaps).values({
    id: mapId,
    title: `Mindmap for "${userInput}"`,
    userId: userId,
    createdAt: new Date(),
  });

  const flatNodes = flattenMindMapTree(object, mapId);

  await db.insert(mindmapNodes).values(flatNodes);
}


export async function selectMindMaps({userId}: {userId: string}) {
  if (!userId) {
    throw new Error("User ID is required to fetch mind maps.");
  }

  const mindMaps = await db.select().from(mindmaps).where(eq(mindmaps.userId, userId));

  return mindMaps;
}


export async function selectMindMapById({userId, id}: {userId: string, id: string}) {
  if (!userId || !id) {
    throw new Error("User ID and mindmap ID are required to fetch a mind map.");
  }

  const mindMap = await db.select().from(mindmaps).where(
    and(eq(mindmaps.userId, userId), eq(mindmaps.id, id))
  );

  return mindMap;
}


export async function selectMindMapNodes({mapId}: {mapId: string}) {
  if (!mapId) {
    throw new Error("Map ID is required to fetch mind map nodes.");
  }

  const nodes = await db.select().from(mindmapNodes).where(eq(mindmapNodes.mapId, mapId));

  return nodes;
}


export async function selectProjects({userId}: {userId: string}) {
  if (!userId) {
    throw new Error("User ID is required to fetch projects.");
  }

  const allProjects = await db.select().from(projects).where(eq(projects.userId, userId));

  return allProjects;
}


export async function insertProject({name, description, userId}: {name: string, description: string, userId: string}) {
  const projectId = uuidv4();

  await db.insert(projects).values({
    id: projectId,
    name,
    description,
    userId,
  });
}
