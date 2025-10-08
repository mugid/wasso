"use server";

import { insertMindMap, selectMindMaps, selectMindMap } from "@/server/queries";
import { GenerateWords } from "@/lib/utils";
import { WordNode } from "@/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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

export async function getMindMap(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  const mindMaps = await selectMindMap({ userId: session.user.id, title: slug });
  
  if (mindMaps.length === 0) {
    throw new Error("Mindmap not found");
  }
  
  return mindMaps[0];
}
