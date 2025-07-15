"use server";

import { insertMindMap } from "@/server/queries";
import { GenerateWords } from "@/lib/utils";
import { WordNode } from "@/types";

export async function createMindMap(word: string) {
    const mindmapObject = await GenerateWords(word);
    if (!mindmapObject) {
        throw new Error("Failed to generate mindmap object");
    }

    await insertMindMap({
        userInput: word, 
        object: mindmapObject.object as WordNode
    });

    return mindmapObject.object as WordNode;
}