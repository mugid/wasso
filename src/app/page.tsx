"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileTextIcon, Workflow, SquareMousePointer, Eye, Pickaxe } from "lucide-react";

const features = [
  {
    Icon: FileTextIcon,
    name: "Save your files",
    description: "You can export your mindmaps in different formats",
    href: "/create",
    cta: "Learn more",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Workflow,
    name: "Mindmaps",
    description: "Brainstorm your ideas with mindmaps",
    href: "/create",
    cta: "Learn more",
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3"
  },
  {
    Icon: SquareMousePointer,
    name: "Nodes",
    description: "Customze your nodes with different styles",
    href: "/create",
    cta: "Learn more",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Eye,
    name: "Pitch",
    description: "Show your designs to the world",
    href: "/",
    cta: "Learn more",
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Pickaxe,
    name: "Projects",
    description:
      "Enhance your portfolio with AI-generated briefs",
    href: "/",
    cta: "Learn more",
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

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
        <h1 className="text-5xl font-extrabold tracking-tighter text-center px-10">
          Features
        </h1>
        <p className="text-xl text-center px-10 text-foreground/70 mt-2">
          wasso is an ultimate tool to become a designer
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 mt-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative flex flex-col justify-end overflow-hidden p-6 bg-card/60 rounded-lg shadow-lg ${feature.className}`}
            >
              <div className="translate-y-12 group-hover:-translate-y-2 transition-all duration-300">
                <feature.Icon className="w-8 h-8 mb-2 text-primary group-hover:scale-75 transition-all duration-300 ease-in-out" />
                <h2 className="text-xl font-semibold">{feature.name}</h2>
                <p className="text-sm text-foreground/70 mb-6">
                  {feature.description}
                </p>
                <Button
                  variant="link"
                  asChild
                  size="sm"
                  className="pointer-events-auto p-0"
                >
                  <Link href={feature.href}>
                    {feature.cta}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
