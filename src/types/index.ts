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
  id: string;
  word: string;
  parentId: string | null;
  mapId: string;
};

export type MindMap = {
  id: string;
  title: string;
  userId: string;
  createdAt: Date | null;
};

export type MindMapWithData = MindMap & {
  data: WordNode;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date | null;
};
