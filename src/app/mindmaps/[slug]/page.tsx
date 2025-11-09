import { MindMapWithData } from "@/types"
import { getMindMap } from "../actions"
import { Suspense } from "react"
import MindMap from "@/components/mindmap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

async function MindMapContent({ id }: { id: string }) {
  try {
    const mindmap: MindMapWithData = await getMindMap(id)
    
    return (
      <div className="w-full h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/mindmaps">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{mindmap.title}</h1>
              {mindmap.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Created {mindmap.createdAt.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <MindMap data={mindmap.data} />
        </div>
      </div>
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not authenticated") {
        notFound()
      }
      if (error.message === "Mindmap not found" || error.message === "Mindmap has no nodes") {
        notFound()
      }
    }
    throw error
  }
}

export default async function MindMapPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <div>Loading mindmap...</div>
      </div>
    }>
      <MindMapContent id={slug} />
    </Suspense>
  )
}