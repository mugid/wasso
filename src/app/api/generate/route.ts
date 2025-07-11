import { generateObject } from "ai";
import { createAzure } from "@ai-sdk/azure";
import { z } from "zod";


export async function getGeneratedWords(userInput: string) {

  
  
  const azure = createAzure({
    resourceName: "beksl-mcqdprhs-eastus2",
    apiKey: process.env.NEXT_PUBLIC_AZURE_API_KEY,
  });

  const { object } = await generateObject({
    model: azure("o4-mini"),
    output: 'no-schema',
    prompt: `
You are a mind map generator for logo designers. 

Based on the input word: "${userInput}", generate a nested mind map. Each node must have:
- a "word" (association or related concept),
- a "children" array (with 2-4 deeper related concepts).

The tree should have a depth of 2 to 3 levels. Output strictly in the required format.
`,
  });

  return { object };
}
