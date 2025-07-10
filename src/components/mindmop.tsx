'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type WordNode = {
  word: string;
  children: WordNode[];
};

type PositionedNode = {
  id: string;
  word: string;
  x: number;
  y: number;
  parentId?: string;
};

let nodeIdCounter = 0;

// Layout helper
function layoutTree(
  node: WordNode,
  x: number,
  y: number,
  parentId?: string
): PositionedNode[] {
  const id = `node-${nodeIdCounter++}`;
  const current: PositionedNode = { id, word: node.word, x, y, parentId };
  let result = [current];

  node.children.forEach((child, index) => {
    const offsetY = index * 100;
    const childX = x + 200;
    const childY = y + offsetY;
    const childNodes = layoutTree(child, childX, childY, id);
    result = result.concat(childNodes);
  });

  return result;
}

export default function MindMap({ data }: { data: WordNode }) {
  const [nodes, setNodes] = useState<PositionedNode[]>([]);
  const nodeRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const [lines, setLines] = useState<
    { from: { x: number; y: number }; to: { x: number; y: number } }[]
  >([]);

  useEffect(() => {
    nodeIdCounter = 0;
    const laidOut = layoutTree(data, 100, 100);
    setNodes(laidOut);
  }, [data]);

  useLayoutEffect(() => {
    const newLines: typeof lines = [];

    nodes.forEach((node) => {
      if (!node.parentId) return;
      const fromEl = nodeRefs.current[node.parentId];
      const toEl = nodeRefs.current[node.id];
      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      newLines.push({
        from: {
          x: fromRect.left + fromRect.width / 2,
          y: fromRect.top + fromRect.height / 2,
        },
        to: {
          x: toRect.left + toRect.width / 2,
          y: toRect.top + toRect.height / 2,
        },
      });
    });

    setLines(newLines);
  }, [nodes]);

  return (
    <div className="relative w-full h-screen overflow-auto">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            stroke="#888"
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          ref={(el) => { nodeRefs.current[node.id] = el; }}
          className="absolute z-10 px-4 py-2 bg-blue-800 border rounded shadow text-sm text-center"
          style={{ left: node.x, top: node.y }}
        >
          {node.word}
        </div>
      ))}
    </div>
  );
}
