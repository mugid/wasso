import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createAzure } from "@ai-sdk/azure";
import { z } from "zod";

export async function getGeneratedWords() {
  const azure = createAzure({
    resourceName: "wasso",
    apiKey: process.env.NEXT_PUBLIC_AZURE_API_KEY,
  });

  const { object } = await generateObject({
    model: azure('gpt-04-mini'),
    schema: z.object({
      words: z.array(z.string()),
    }),
    prompt: "Generate a list of 10 random words",
  });

  console.log("Generated words:", object.words);
}
