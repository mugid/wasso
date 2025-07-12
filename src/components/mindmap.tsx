"use client"

import { useEffect, useRef, useCallback } from "react"
import { useMindmapStore, layoutTree } from "@/lib/mindmap-store"
import { WordNode } from "@/types"

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
    <div className="w-full h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
          }}
        >

          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ overflow: "visible" }}>
            {lines.map((line) => (
              <line
                key={line.id}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke="#FFFFFF"
                strokeWidth={2}
                opacity={0.8}
              />
            ))}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[node.id] = el
              }}
              className={`
                absolute z-10 rounded-lg
                text-center cursor-move  
                
                ${node.level === 0 ? "text-lg" : "text-sm"}
                ${isDragging && dragNode === node.id ? "" : ""}
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

      <div className="absolute top-4 left-4 flex flex-col z-20">
        <button
          onClick={() => setScale(Math.min(3, scale * 1.2))}
          className=""
        >
          Zoom In
        </button>
        <button
          onClick={() => setScale(Math.max(0.3, scale / 1.2))}
          className=""
        >
          Zoom Out
        </button>
        <button
          onClick={reset}
          className=""
        >
          Reset
        </button>
      </div>
      <div className="absolute bottom-4 right-4 z-20">
        <span className="">Zoom: {Math.round(scale * 100)}%</span>
      </div>
    </div>
  )
}
