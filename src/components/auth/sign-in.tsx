"use client";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button"

const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};

export function SignIn() {
  return <Button onClick={signIn}>Sign In</Button>;
}
