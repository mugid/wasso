import { MindMapForm } from "./_components/mindmapForm";
import { getMindMaps } from "./actions";

type MindMap = {
  id: string;
  title: string;
  userId: string;
  createdAt: Date | null;
};


export default async function MindMaps() {
  const mindmaps: MindMap[] = await getMindMaps();

  return (
    <div className="min-h-screen">
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
