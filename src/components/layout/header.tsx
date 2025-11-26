import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

//prolly gotta swith to client component
export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="fixed w-7xl top-10 left-[50%] translate-x-[-50%] z-30 backdrop-blur-md flex items-center justify-between py-4 px-10 border-2 border-accent rounded-full">
      <div>
        <Link href="/">
          <Image src={"/logo.svg"} alt="logo" width={20} height={20} />
        </Link>
      </div>
      <nav>
        <div className="flex items-center space-x-4">
          <Link href="/mindmaps" className="hover:underline">
            mindmaps
          </Link>
          <Link href="/dashboard" className="hover:underline">
            dashboard
          </Link>
        </div>
      </nav>
      <div className="flex items-center space-x-4">
        {session ? (
          <Button className="rounded-full">
            <Link href="/profile">Profile</Link>
          </Button>
        ) : (
          <Button className="rounded-full" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
