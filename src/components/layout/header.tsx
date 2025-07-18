import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { SignIn } from "../auth/sign-in";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="fixed w-full z-30 backdrop-blur-md flex items-center justify-between py-4 px-10 border-b-2 border-b-accent">
      <div>
        <Link href="/">wasso</Link>
      </div>
      <nav>
        <div className="flex items-center space-x-4">
          <Link href="/create" className="hover:underline">
            create
          </Link>
        </div>
      </nav>
      <div className="flex items-center space-x-4">
        {session ? (
          <Button>
            <Link href="/profile">Profile</Link>
          </Button>
        ) : (
          <SignIn />
        )}
      </div>
    </header>
  );
}
