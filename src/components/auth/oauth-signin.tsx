"use client";

import * as React from "react";

import { authClient } from "@/lib/auth-client";

interface OAuthSignInProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  callbackUrl?: string;
}

export function OAuthSignIn({
  loading,
  setLoading,
  callbackUrl,
}: OAuthSignInProps) {
  async function oauthSignin() {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl ?? "/studio",
      });
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2">
      <div className="grid grid-cols-2 items-stretch justify-center gap-2">
        <button onClick={() => void oauthSignin()} disabled={loading}>
          <span className="flex w-full flex-row flex-nowrap items-center justify-center gap-3 overflow-hidden">
            <span className="flex flex-shrink-0 flex-grow-0 basis-4 flex-row flex-nowrap items-center justify-center"></span>
            <span className="m-0 overflow-hidden truncate whitespace-nowrap text-[0.8125rem] font-medium leading-snug tracking-normal text-inherit">
              Google
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
