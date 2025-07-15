import { WordNode, FlatNode } from '../types';
import { v4 as uuidv4 } from 'uuid';


export function flattenMindMapTree(
  node: WordNode,
  mapId: string,
  parentId: string | null = null
): FlatNode[] {

  const id = uuidv4()


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
