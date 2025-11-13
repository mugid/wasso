"use server";

import { insertMindMap, selectMindMaps, selectMindMapById, selectMindMapNodes } from "@/server/queries";
import { GenerateWords } from "@/lib/utils";
import { WordNode, FlatNode } from "@/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { unflattenTree } from "@/lib/unflattenTree";


export async function createMindMap(word: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const mindmapObject = await GenerateWords(word);
  if (!mindmapObject) {
    throw new Error("Failed to generate mindmap object");
  }

  await insertMindMap({
    userInput: word,
    userId: session.user.id,
    object: mindmapObject.object as WordNode,
  });

  return mindmapObject.object as WordNode;
}


export async function getMindMaps() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const mindMaps = await selectMindMaps({ userId: session.user.id });
  
  return mindMaps
}


export async function getMindMap(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  
  const mindMaps = await selectMindMapById({ userId: session.user.id, id });
  
  if (mindMaps.length === 0) {
    throw new Error("Mindmap not found");
  }
  
  const mindMap = mindMaps[0];
  

  const flatNodes = await selectMindMapNodes({ mapId: mindMap.id });
  
  if (flatNodes.length === 0) {
    throw new Error("Mindmap has no nodes");
  }
  

  const nodes: FlatNode[] = flatNodes.map(node => ({
    id: node.id,
    word: node.word,
    parentId: node.parentId,
    mapId: node.mapId,
  }));
  
  const tree = unflattenTree(nodes);
  
  return {
    ...mindMap,
    data: tree,
  };
}
