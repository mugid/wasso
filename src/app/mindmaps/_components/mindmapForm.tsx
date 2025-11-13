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

import { useCreate } from "../use-create";


export function MindMapForm() {
  const { loading, onSubmit, form } = useCreate();

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-center w-[30%]"
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
          <Button type="submit" disabled={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
