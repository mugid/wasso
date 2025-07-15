"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getGeneratedWords } from "@/lib/utils";

import MindMap from "./mindmap";
import { WordNode } from "@/types"; 
import { insertMindMap } from "@/server/queries";


const sampleData: WordNode = {
  word: "Project Planning",
  children: [
    {
      word: "Research",
      children: [
        { word: "Market Analysis", children: [] },
        { word: "User Interviews", children: [] },
        { word: "Competitor Study", children: [] },
      ],
    },
    {
      word: "Design",
      children: [
        { word: "Wireframes", children: [] },
        { word: "Prototypes", children: [] },
        { word: "User Testing", children: [] },
      ],
    },
    {
      word: "Development",
      children: [
        { word: "Frontend", children: [] },
        { word: "Backend", children: [] },
        { word: "Database", children: [] },
      ],
    },
  ],
}

const formSchema = z.object({
  word: z.string().min(1, {
    message: "Word is required",
  }),
});


export function CreateMindMapForm() {
  const [result, setResult] = useState<WordNode>();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const generated = await getGeneratedWords(values.word);
      setResult(generated.object as WordNode);
      insertMindMap(values.word, generated.object as WordNode);
      // handle result here (e.g., set state, show result, etc.)
      console.log(generated);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="fixed z-2 flex items-center justify-center w-[25%]">
          <FormField
            control={form.control}
            name="word"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="enter the word" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {sampleData && <MindMap data={sampleData} />}
    </div>
  );
}
