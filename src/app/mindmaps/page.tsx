import { MindMapForm } from "./_components/mindmapForm";
import { getMindMaps } from "./actions";
import { MindMap } from "@/types";


export default async function MindMaps() {
  const mindmaps: MindMap[] = await getMindMaps();

  return (
    <div className="px-10 pt-10 min-h-screen">
      <MindMapForm />
      {mindmaps.map((mindmap) => (
        <div key={mindmap.id} className="p-4 border-b">
          <h3 className="text-lg font-semibold">{mindmap.title}</h3>
          <p className="text-sm text-gray-500">
            Created at: {mindmap.createdAt?.toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
