import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { WordNode } from "@/types"; 
import { createMindMap } from "./actions";



const formSchema = z.object({
  word: z.string().min(1, {
    message: "Word is required",
  }),
});


export const useCreate = () => {
  const router = useRouter();
  const [result, setResult] = useState<WordNode>();
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const generated = await createMindMap(values.word);
      setResult(generated as WordNode | undefined);
      console.log(generated);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      form.reset();
      router.refresh()
    }
  }

  return {loading, onSubmit, result, form};
}
