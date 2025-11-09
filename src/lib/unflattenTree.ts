import { WordNode, FlatNode } from '../types';

export function unflattenTree(flatNodes: FlatNode[]): WordNode {
  if (flatNodes.length === 0) {
    throw new Error("Cannot unflatten an empty array of nodes");
  }

  // Find the root node (parentId is null)
  const rootNode = flatNodes.find(node => node.parentId === null);
  
  if (!rootNode) {
    throw new Error("No root node found (node with parentId === null)");
  }

  // Build a map of parentId to children for efficient lookup
  const childrenMap = new Map<string | null, FlatNode[]>();
  
  flatNodes.forEach(node => {
    const parentId = node.parentId;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(node);
  });

  // Recursive function to build the tree
  function buildNode(node: FlatNode): WordNode {
    const children = childrenMap.get(node.id) || [];
    return {
      word: node.word,
      children: children.map(child => buildNode(child)),
    };
  }

  return buildNode(rootNode);
}

