"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, RotateCcw } from "lucide-react"

interface Node {
  id: string
  x: number
  y: number
  text: string
  color: string
  connections: string[]
  radius: number
}

interface Connection {
  from: string
  to: string
}

export default function MindmapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", x: 400, y: 300, text: "Central Idea", color: "#3b82f6", connections: ["2", "3", "4"], radius: 60 },
    { id: "2", x: 200, y: 200, text: "Branch 1", color: "#10b981", connections: ["1"], radius: 50 },
    { id: "3", x: 600, y: 200, text: "Branch 2", color: "#f59e0b", connections: ["1"], radius: 50 },
    { id: "4", x: 400, y: 500, text: "Branch 3", color: "#ef4444", connections: ["1"], radius: 50 },
  ])

  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const getMousePos = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
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
        const dx = node.x - x
        const dy = node.y - y
        return Math.sqrt(dx * dx + dy * dy) <= node.radius
      })
    },
    [nodes],
  )

  const drawNode = useCallback(
    (ctx: CanvasRenderingContext2D, node: Node) => {
      const isSelected = selectedNode === node.id
      const isEditing = editingNode === node.id

      // Shadow
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Node background
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius)
      gradient.addColorStop(0, node.color)
      gradient.addColorStop(1, node.color + "80")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx.fill()

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()

      // Text
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.max(12, node.radius / 4)}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (isEditing) {
        // Draw editing indicator
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius - 5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Wrap text
      const words = node.text.split(" ")
      const maxWidth = node.radius * 1.5
      const lines: string[] = []
      let currentLine = ""

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      })
      if (currentLine) lines.push(currentLine)

      const lineHeight = Math.max(14, node.radius / 3)
      const startY = node.y - ((lines.length - 1) * lineHeight) / 2

      lines.forEach((line, i) => {
        ctx.fillText(line, node.x, startY + i * lineHeight)
      })
    },
    [selectedNode, editingNode],
  )

  const drawConnection = useCallback((ctx: CanvasRenderingContext2D, from: Node, to: Node) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) return

    const fromX = from.x + (dx / distance) * from.radius
    const fromY = from.y + (dy / distance) * from.radius
    const toX = to.x - (dx / distance) * to.radius
    const toY = to.y - (dy / distance) * to.radius

    // Curved line
    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2
    const controlX = midX + (toY - fromY) * 0.2
    const controlY = midY - (toX - fromX) * 0.2

    const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY)
    gradient.addColorStop(0, from.color + "80")
    gradient.addColorStop(1, to.color + "80")

    ctx.strokeStyle = gradient
    ctx.lineWidth = 3
    ctx.lineCap = "round"

    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.quadraticCurveTo(controlX, controlY, toX, toY)
    ctx.stroke()
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    // Draw connections
    nodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const connectedNode = nodes.find((n) => n.id === connectionId)
        if (connectedNode) {
          drawConnection(ctx, node, connectedNode)
        }
      })
    })

    // Draw nodes
    nodes.forEach((node) => drawNode(ctx, node))

    ctx.restore()
  }, [nodes, offset, scale, drawNode, drawConnection])

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const pos = getMousePos(e)
      const node = getNodeAt(pos.x, pos.y)

      if (node) {
        if (e.detail === 2) {
          // Double click
          setEditingNode(node.id)
          setEditText(node.text)
          return
        }

        setDragNode(node.id)
        setSelectedNode(node.id)
        setDragStart({ x: pos.x - node.x, y: pos.y - node.y })
        setIsDragging(true)
      } else {
        setSelectedNode(null)
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
      const newScale = Math.max(0.1, Math.min(3, scale * delta))
      setScale(newScale)
    },
    [scale],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("wheel", handleWheel)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel])

  useEffect(() => {
    draw()
  }, [draw])

  const addNode = () => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
    const newNode: Node = {
      id: Date.now().toString(),
      x: 400 + Math.random() * 200 - 100,
      y: 300 + Math.random() * 200 - 100,
      text: "New Node",
      color: colors[Math.floor(Math.random() * colors.length)],
      connections: [],
      radius: 50,
    }
    setNodes((prev) => [...prev, newNode])
  }

  const zoomIn = () => setScale((prev) => Math.min(3, prev * 1.2))
  const zoomOut = () => setScale((prev) => Math.max(0.1, prev / 1.2))
  const resetView = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleEditSubmit = () => {
    if (editingNode) {
      setNodes((prev) => prev.map((node) => (node.id === editingNode ? { ...node, text: editText } : node)))
      setEditingNode(null)
      setEditText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit()
    } else if (e.key === "Escape") {
      setEditingNode(null)
      setEditText("")
    }
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Button onClick={addNode} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1" />
          Add Node
        </Button>
        <div className="flex gap-1">
          <Button onClick={zoomIn} size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
          <Button onClick={zoomOut} size="sm" variant="outline">
            <Minus className="w-4 h-4" />
          </Button>
          <Button onClick={resetView} size="sm" variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingNode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg shadow-lg">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter node text"
            className="mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={handleEditSubmit} size="sm">
              Save
            </Button>
            <Button onClick={() => setEditingNode(null)} size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-sm p-3 rounded">
        <div>• Drag nodes to move them</div>
        <div>• Double-click to edit text</div>
        <div>• Mouse wheel to zoom</div>
        <div>• Drag empty space to pan</div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 text-sm p-2 rounded">
        Zoom: {Math.round(scale * 100)}%
      </div>
    </div>
  )
}
