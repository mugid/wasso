"use server";

import { mindmaps, mindmapNodes} from "@/lib/db/schema";
import { flattenMindMapTree } from "@/lib/flattenTree";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
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
