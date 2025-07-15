"use server";

import { mindmaps, mindmapNodes } from "@/lib/db/schema";
import { flattenMindMapTree } from "@/lib/flattenTree";
import { db } from "@/lib/db";
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
