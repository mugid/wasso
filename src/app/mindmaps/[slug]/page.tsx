import { MindMap } from "@/types"
import { getMindMap } from "../actions"

export default async function MindMapPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const mindmap: MindMap = await getMindMap(slug)
  return <div>My Post: {mindmap.title}</div>
}