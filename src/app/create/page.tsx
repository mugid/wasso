"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useCreate } from "./use-create";
import MindMap from "../../components/mindmap";

import { WordNode } from "@/types";


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
};

export default function CreateMindMap() {
  const { loading, onSubmit, result, form } = useCreate();

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="fixed z-2 flex items-center justify-center w-[25%]"
        >
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
