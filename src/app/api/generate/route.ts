import { generateObject } from "ai";
import { createAzure } from "@ai-sdk/azure";
import { z } from "zod";

export async function getGeneratedWords() {
  const azure = createAzure({
    resourceName: "beksl-mcqdprhs-eastus2",
    apiKey: process.env.NEXT_PUBLIC_AZURE_API_KEY,
  });

  const { object } = await generateObject({
    model: azure('o4-mini'),
    schema: z.object({
      words: z.array(z.string()),
    }),
    prompt: "Generate a list of 10 random words",
  });

  return { object };
}
