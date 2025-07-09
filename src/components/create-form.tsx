"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getGeneratedWords } from "@/app/api/generate/route";

const formSchema = z.object({
  word: z.string().min(1, {
    message: "Word must be at least 1 characters.",
  }),
});

import { useState } from "react";

export function CreateMindMapForm() {
  const [result, setResult] = useState<object | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const generated = await getGeneratedWords(values.word);
      setResult(generated);
      // handle result here (e.g., set state, show result, etc.)
      console.log(generated);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="word"
            render={({ field }) => (
              <FormItem>
                <FormLabel>word</FormLabel>
                <FormControl>
                  <Input placeholder="enter the word" {...field} />
                </FormControl>
                <FormDescription>
                  This is the word you want to generate a mind map for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p>{result ? JSON.stringify(result) : "Nothing"}</p>
    </>
  );
}
