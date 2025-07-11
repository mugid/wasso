"use client"

import { useEffect, useRef, useCallback } from "react"
import { useMindmapStore, layoutTree, type WordNode } from "@/lib/mindmap-store"

export default function MindMap({ data }: { data: WordNode }) {
  const {
    nodes,
    lines,
    scale,
    offset,
    isDragging,
    dragNode,
    isPanning,
    setNodes,
    updateNodePosition,
    setScale,
    setOffset,
    setDragging,
    setPanning,
    reset,
  } = useMindmapStore()

  const nodeRefs = useRef<{ [id: string]: HTMLDivElement | null }>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })

  // Initialize layout when data changes
  useEffect(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const laidOut = layoutTree(data, centerX, centerY)
    setNodes(laidOut)
  }, [data, setNodes])

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

        // Check if click is within node bounds (accounting for centered positioning)
        return x >= node.x - nodeW / 2 && x <= node.x + nodeW / 2 && y >= node.y - nodeH / 2 && y <= node.y + nodeH / 2
      })
    },
    [nodes, scale],
  )

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const pos = getMousePos(e)
      const node = getNodeAt(pos.x, pos.y)

      if (node) {
        setDragging(true, node.id)
        dragStartRef.current = { x: pos.x - node.x, y: pos.y - node.y }
      } else {
        setPanning(true)
        dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
      }
    },
    [getMousePos, getNodeAt, offset, setDragging, setPanning],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && dragNode) {
        const pos = getMousePos(e)
        updateNodePosition(dragNode, pos.x - dragStartRef.current.x, pos.y - dragStartRef.current.y)
      } else if (isPanning) {
        setOffset({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y,
        })
      }
    },
    [isDragging, dragNode, isPanning, getMousePos, updateNodePosition, setOffset],
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
    setPanning(false)
  }, [setDragging, setPanning])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.3, Math.min(3, scale * delta))
      setScale(newScale)
    },
    [scale, setScale],
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
    <div className="w-full h-[90vh] overflow-hidden bg-white">
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
          }}
        >
          {/* SVG for lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ overflow: "visible" }}>
            {lines.map((line) => (
              <line
                key={line.id}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke="#666"
                strokeWidth={2}
                opacity={0.8}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[node.id] = el
              }}
              className={`
                absolute z-10 px-3 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm
                font-medium text-center cursor-move hover:shadow-md transition-shadow duration-200
                select-none text-gray-800
                ${node.level === 0 ? "text-lg font-bold border-gray-500" : "text-sm"}
                ${isDragging && dragNode === node.id ? "shadow-lg" : ""}
              `}
              style={{
                left: node.x,
                top: node.y,
                transform: `translate(-50%, -50%)`,
                minWidth: node.level === 0 ? "120px" : "80px",
              }}
            >
              {node.word}
            </div>
          ))}
        </div>
      </div>

      {/* Simple Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 p-3 bg-white rounded-lg shadow-md z-20 border border-gray-200">
        <button
          onClick={() => setScale(Math.min(3, scale * 1.2))}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
        >
          Zoom In
        </button>
        <button
          onClick={() => setScale(Math.max(0.3, scale / 1.2))}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
        >
          Zoom Out
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-sm p-3 bg-white rounded-lg shadow-md z-20 border border-gray-200">
        <div className="font-medium mb-1 text-gray-800">Controls:</div>
        <div className="text-gray-600">• Drag nodes to move</div>
        <div className="text-gray-600">• Drag background to pan</div>
        <div className="text-gray-600">• Mouse wheel to zoom</div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 text-sm p-2 bg-white rounded-lg shadow-md z-20 border border-gray-200">
        <span className="font-medium text-gray-800">Zoom: {Math.round(scale * 100)}%</span>
      </div>
    </div>
  )
}
