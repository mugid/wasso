"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { createProject } from "./actions";


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Word is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
});


export const useCreateProject = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await createProject(values.name, values.description);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      form.reset();
      router.refresh()
    }
  }

  return {loading, onSubmit, form};
}
