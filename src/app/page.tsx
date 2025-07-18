"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="flex flex-col items-center justify-center min-h-screen mx-4">
        <h1 className="text-5xl font-extrabold tracking-tighter text-center px-10 py-4">
          The Tool for Brainstorming and Design
        </h1>
        <p className="text-xl max-w-[800px] text-center px-10 py-4 text-foreground/70">
          Supercharge your logo design process with{" "}
          <span className="font-semibold italic font-serif">
            AI-powered word association maps
          </span>{" "}
          that unlock ideas, emotions, and brand directions—instantly.
        </p>
        <Button className="p-6 mt-6 text-lg w-[200px]">
          <Link href="/create">Get Started</Link>
        </Button>
      </section>
      <section className="min-h-screen">
        <h1></h1>
      </section>
    </div>
  );
}
