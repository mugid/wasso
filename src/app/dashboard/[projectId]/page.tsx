import { Suspense } from "react"


export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <div>Loading Project...</div>
      </div>
    }>
      <div>{slug}</div>
    </Suspense>
  )
}