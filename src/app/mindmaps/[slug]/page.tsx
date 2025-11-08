import { MindMap } from "@/types"
import { getMindMap } from "../actions"
import { Suspense } from "react"

async function MindMapContent({ slug }: { slug: string }) {
  const mindmap: MindMap = await getMindMap(slug)
  return <div>My Post: {mindmap.title}</div>
}

export default async function MindMapPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MindMapContent slug={slug} />
    </Suspense>
  )
}