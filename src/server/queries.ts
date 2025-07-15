"use server";

import { mindmaps, mindmapNodes } from "@/lib/db/schema";
import { flattenMindMapTree } from "@/lib/flattenTree";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

import { WordNode } from "@/types";

export async function insertMindMap(userInput: string, object: WordNode) {
  const mapId = uuidv4();

  await db.insert(mindmaps).values({
    id: mapId,
    title: `Mindmap for "${userInput}"`,
    userId: "wl3FfTo6bXVYH8E57qWodJROnJr4HfZ4",
    createdAt: new Date(),
  });

  // Ensure object is of the expected type and has a 'children' property
  const children =
    typeof object === "object" && object !== null && "children" in object
      ? (object as { children: any }).children
      : [];

  const flatNodes = flattenMindMapTree(children, mapId);

  await db.insert(mindmapNodes).values(flatNodes);
}
