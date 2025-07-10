"use client"

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react"

export type WordNode = {
  word: string
  children: WordNode[]
}

type PositionedNode = {
  id: string
  word: string
  x: number
  y: number
  parentId?: string
  level: number
}

let nodeIdCounter = 0

// Layout helper
function layoutTree(node: WordNode, x: number, y: number, level = 0, parentId?: string): PositionedNode[] {
  const id = `node-${nodeIdCounter++}`
  const current: PositionedNode = { id, word: node.word, x, y, parentId, level }
  let result = [current]

  node.children.forEach((child, index) => {
    const offsetY = index * 80
    const childX = x + 250
    const childY = y + offsetY - (node.children.length - 1) * 40
    const childNodes = layoutTree(child, childX, childY, level + 1, id)
    result = result.concat(childNodes)
  })

  return result
}

export default function MindMap({ data }: { data: WordNode }) {
  const [nodes, setNodes] = useState<PositionedNode[]>([])
  const nodeRefs = useRef<{ [id: string]: HTMLDivElement | null }>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } }[]>([])

  // Pan and zoom state
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)

  useEffect(() => {
    nodeIdCounter = 0
    const laidOut = layoutTree(data, 100, 300)
    setNodes(laidOut)
  }, [data])

  const updateLines = useCallback(() => {
    const newLines: typeof lines = []
    nodes.forEach((node) => {
      if (!node.parentId) return

      const parentNode = nodes.find((n) => n.id === node.parentId)
      if (!parentNode) return

      const fromEl = nodeRefs.current[node.parentId]
      const toEl = nodeRefs.current[node.id]
      if (!fromEl || !toEl) return

      // Calculate connection points based on node positions and dimensions
      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()

      const fromWidth = fromRect.width / scale
      const toWidth = toRect.width / scale
      const fromHeight = fromRect.height / scale
      const toHeight = toRect.height / scale

      newLines.push({
        from: {
          x: parentNode.x + fromWidth,
          y: parentNode.y + fromHeight / 2,
        },
        to: {
          x: node.x,
          y: node.y + toHeight / 2,
        },
      })
    })
    setLines(newLines)
  }, [nodes, scale])

  useLayoutEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(updateLines, 10)
    return () => clearTimeout(timer)
  }, [updateLines])

  const getMousePos = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return { x: 0, y: 0 }
      const rect = containerRef.current.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left - offset.x) / scale,
        y: (e.clientY - rect.top - offset.y) / scale,
      }
    },
    [offset, scale],
  )

  const getNodeAt = useCallback(
    (x: number, y: number) => {
      return nodes.find((node) => {
        const nodeEl = nodeRefs.current[node.id]
        if (!nodeEl) return false

        const rect = nodeEl.getBoundingClientRect()
        const nodeW = rect.width / scale
        const nodeH = rect.height / scale

        return x >= node.x && x <= node.x + nodeW && y >= node.y && y <= node.y + nodeH
      })
    },
    [nodes, scale],
  )

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const pos = getMousePos(e)
      const node = getNodeAt(pos.x, pos.y)

      if (node) {
        setDragNode(node.id)
        setDragStart({ x: pos.x - node.x, y: pos.y - node.y })
        setIsDragging(true)
      } else {
        setIsPanning(true)
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
      }
    },
    [getMousePos, getNodeAt, offset],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && dragNode) {
        const pos = getMousePos(e)
        setNodes((prev) =>
          prev.map((node) =>
            node.id === dragNode ? { ...node, x: pos.x - dragStart.x, y: pos.y - dragStart.y } : node,
          ),
        )
      } else if (isPanning) {
        setOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragNode, isPanning, dragStart, getMousePos],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragNode(null)
    setIsPanning(false)
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.3, Math.min(2, scale * delta))
      setScale(newScale)
    },
    [scale],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    container.addEventListener("wheel", handleWheel)

    return () => {
      container.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      container.removeEventListener("wheel", handleWheel)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        {/* Content container that gets transformed */}
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
          }}
        >
          {/* SVG for lines - now part of the transformed content */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ overflow: "visible" }}>
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#00000020" />
              </filter>
            </defs>
            {lines.map((line, i) => {
              // Create curved line using quadratic curve
              const midX = (line.from.x + line.to.x) / 2
              const midY = (line.from.y + line.to.y) / 2
              const controlX = midX
              const controlY = line.from.y

              return (
                <path
                  key={i}
                  d={`M ${line.from.x} ${line.from.y} Q ${controlX} ${controlY} ${line.to.x} ${line.to.y}`}
                  stroke="#666"
                  strokeWidth={2}
                  fill="none"
                  opacity={0.7}
                  filter="url(#shadow)"
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[node.id] = el
              }}
              className={`
                absolute z-10 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-md
                text-gray-800 font-medium text-center cursor-move
                hover:border-gray-400 hover:shadow-lg transition-all duration-200
                select-none
                ${node.level === 0 ? "text-lg font-bold px-6 py-3 border-gray-500" : "text-sm"}
              `}
              style={{
                left: node.x,
                top: node.y,
                minWidth: node.level === 0 ? "140px" : "100px",
              }}
            >
              {node.word}
            </div>
          ))}
        </div>
      </div>

      {/* Controls - outside the transformed content */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md z-20">
        <button
          onClick={() => setScale((prev) => Math.min(2, prev * 1.2))}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
        >
          Zoom In
        </button>
        <button
          onClick={() => setScale((prev) => Math.max(0.3, prev / 1.2))}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
        >
          Zoom Out
        </button>
        <button
          onClick={() => {
            setScale(1)
            setOffset({ x: 0, y: 0 })
          }}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
        >
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white p-3 rounded-lg shadow-md z-20">
        <div>• Drag nodes to move them</div>
        <div>• Drag empty space to pan</div>
        <div>• Mouse wheel to zoom</div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 text-sm text-gray-600 bg-white p-2 rounded-lg shadow-md z-20">
        Zoom: {Math.round(scale * 100)}%
      </div>
    </div>
  )
}
