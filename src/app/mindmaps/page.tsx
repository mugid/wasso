import { MindMapForm } from "./_components/mindmapForm";
import { getMindMaps } from "./actions";
import { MindMap } from "@/types";
import { Suspense } from "react";
import Link from "next/link";

async function MindMapsList() {
  const mindmaps: MindMap[] = await getMindMaps();

  return (
    <>
      {mindmaps.map((mindmap) => (
        <div key={mindmap.id} className="p-4 border-b hover:bg-accent/50 transition-colors">
          <Link href={`/mindmaps/${mindmap.id}`} className="block">
            <h3 className="text-lg font-semibold hover:underline">{mindmap.title}</h3>
            <p className="text-sm text-muted-foreground">
              Created at: {mindmap.createdAt?.toLocaleDateString()}
            </p>
          </Link>
        </div>
      ))}
    </>
  );
}

export default async function MindMaps() {
  return (
    <div className="px-10 pt-10 min-h-screen">
      <MindMapForm />
      <Suspense fallback={<div>Loading mindmaps...</div>}>
        <MindMapsList />
      </Suspense>
    </div>
  );
}
