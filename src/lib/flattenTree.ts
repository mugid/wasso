import { WordNode, FlatNode } from '../types';


export function flattenMindMapTree(
  node: WordNode,
  mapId: string,
  parentId: string | null = null
): FlatNode[] {


  const flatNode: FlatNode = {
    id,
    word: node.word,
    parentId,
    mapId,
  };

  const children = node.children.flatMap((child) =>
    flattenMindMapTree(child, mapId,)
  );

  return [flatNode, ...children]; 
}
