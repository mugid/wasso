import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { SignIn } from "../auth/sign-in";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

//prolly gotta swith to client component
export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="fixed top-0 w-full z-30 backdrop-blur-md flex items-center justify-between py-4 px-10 border-b-2 border-b-accent">
      <div>
        <Link href="/">
          <Image
            src={"/logo-light.svg"}
            alt="logo"
            className="dark:hidden"
            width={100}
            height={100}
          />
          <Image
            src={"/logo-dark.svg"}
            alt="logo"
            className="hidden dark:block"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <nav>
        <div className="flex items-center space-x-4">
          <Link href="/mindmaps" className="hover:underline">
            mindmaps
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
