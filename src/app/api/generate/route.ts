import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

export async function getGeneratedWords() {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const { object } = await generateObject({
    model: openrouter('cypher-alpha:free'),
    schema: z.object({
      words: z.array(z.string()),
    }),
    prompt: "Generate a list of 10 random words",
  });

  console.log("Generated words:", object.words);
}
