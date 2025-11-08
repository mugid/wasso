import { MindMapForm } from "./_components/mindmapForm";
import { getMindMaps } from "./actions";
import { MindMap } from "@/types";
import { Suspense } from "react";

async function MindMapsList() {
  const mindmaps: MindMap[] = await getMindMaps();

  return (
    <>
      {mindmaps.map((mindmap) => (
        <div key={mindmap.id} className="p-4 border-b">
          <a href={`/mindmaps/${mindmap.title}`} className="hover:underline">
          <h3 className="text-lg font-semibold">{mindmap.title}</h3>
          <p className="text-sm text-gray-500">
            Created at: {mindmap.createdAt?.toLocaleDateString()}
          </p>
          </a>
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
