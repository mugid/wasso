import { create } from "zustand"
import { WordNode, PositionedNode, Line } from "@/types"


interface MindmapState {
  nodes: PositionedNode[]
  lines: Line[]
  scale: number
  offset: { x: number; y: number }
  isDragging: boolean
  dragNode: string | null
  isPanning: boolean

  // Actions
  setNodes: (nodes: PositionedNode[]) => void
  updateNodePosition: (nodeId: string, x: number, y: number) => void
  setLines: (lines: Line[]) => void
  updateLines: () => void
  setScale: (scale: number) => void
  setOffset: (offset: { x: number; y: number }) => void
  setDragging: (isDragging: boolean, nodeId?: string) => void
  setPanning: (isPanning: boolean) => void
  reset: () => void
}

let nodeIdCounter = 0

// Improved layout algorithm - center-based with balanced distribution
function layoutTree(
  node: WordNode,
  centerX: number,
  centerY: number,
  level = 0,
  parentId?: string,
  angle = 0,
  angleSpan = Math.PI * 2,
): PositionedNode[] {
  const id = `node-${nodeIdCounter++}`

  let x = centerX
  let y = centerY

  // For non-root nodes, position them in a radial pattern
  if (level > 0) {
    const radius = level * 200 // Distance from center increases with level
    x = centerX + Math.cos(angle) * radius
    y = centerY + Math.sin(angle) * radius
  }

  const current: PositionedNode = {
    id,
    word: node.word,
    x,
    y,
    parentId,
    level,
  }

  let result = [current]

  // Distribute children around the parent
  if (node.children.length > 0) {
    const childAngleSpan = level === 0 ? Math.PI * 2 : angleSpan * 0.8
    const startAngle = level === 0 ? 0 : angle - childAngleSpan / 2

    node.children.forEach((child, index) => {
      let childAngle

      if (level === 0) {
        // For root level, distribute evenly around the circle
        childAngle = (index / node.children.length) * Math.PI * 2
      } else {
        // For other levels, distribute within the allocated angle span
        childAngle = startAngle + (index / Math.max(1, node.children.length - 1)) * childAngleSpan
      }

      const childNodes = layoutTree(
        child,
        centerX,
        centerY,
        level + 1,
        id,
        childAngle,
        childAngleSpan / node.children.length,
      )
      result = result.concat(childNodes)
    })
  }

  return result
}

export const useMindmapStore = create<MindmapState>((set, get) => ({
  nodes: [],
  lines: [],
  scale: 1,
  offset: { x: 0, y: 0 },
  isDragging: false,
  dragNode: null,
  isPanning: false,

  setNodes: (nodes) => {
    set({ nodes })
    // Automatically update lines when nodes change
    setTimeout(() => get().updateLines(), 0)
  },

  updateNodePosition: (nodeId, x, y) => {
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, x, y } : node)),
    }))
    // Update lines immediately for smooth dragging
    get().updateLines()
  },

  setLines: (lines) => set({ lines }),

  updateLines: () => {
    const { nodes } = get()
    const newLines: Line[] = []

    nodes.forEach((node) => {
      if (!node.parentId) return

      const parentNode = nodes.find((n) => n.id === node.parentId)
      if (!parentNode) return

      // Calculate precise connection points
      const dx = node.x - parentNode.x
      const dy = node.y - parentNode.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance === 0) return

      // Calculate unit vector
      const unitX = dx / distance
      const unitY = dy / distance

      // Node dimensions (approximate)
      const parentRadius = parentNode.level === 0 ? 60 : 40
      const childRadius = node.level === 1 ? 50 : 40

      // Connection points at node edges
      newLines.push({
        id: `${node.parentId}-${node.id}`,
        from: {
          x: parentNode.x + unitX * parentRadius,
          y: parentNode.y + unitY * parentRadius,
        },
        to: {
          x: node.x - unitX * childRadius,
          y: node.y - unitY * childRadius,
        },
      })
    })

    set({ lines: newLines })
  },

  setScale: (scale) => set({ scale }),
  setOffset: (offset) => set({ offset }),
  setDragging: (isDragging, nodeId) => set({ isDragging, dragNode: nodeId || null }),
  setPanning: (isPanning) => set({ isPanning }),

  reset: () => set({ scale: 1, offset: { x: 0, y: 0 } }),
}))

export { layoutTree }
