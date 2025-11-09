import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Mindmap Not Found</h1>
        <p className="text-muted-foreground">
          The mindmap you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/mindmaps">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mindmaps
          </Link>
        </Button>
      </div>
    </div>
  )
}

