export type WordNode = {
  word: string
  children: WordNode[]
}

export type PositionedNode = {
  id: string
  word: string
  x: number
  y: number
  parentId?: string
  level: number
}

export type Line = {
  from: { x: number; y: number }
  to: { x: number; y: number }
  id: string
}

export type FlatNode = {
  word: string;
  parentId: string | null;
  mapId: string;
};

