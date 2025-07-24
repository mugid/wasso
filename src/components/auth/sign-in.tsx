"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignIn() {
  const router = useRouter();

  const signIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });

      if (data.data) {
        router.refresh();
        router.push("/mindmaps");
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return <Button onClick={signIn}>Sign In</Button>;
}
