import { Literal } from ".";

export interface Block {
  id: string;
  cat: Array<Literal>;
  title: string;
  keywords: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  type: Literal;
  blank?: string;
  position?: number;
  pro?: boolean;
  kitId: string;
}

export interface Categories {
  id: Literal;
  slug: string;
  title: string;
  hidden?: boolean;
}

export interface DefaultBlock {
  type: string;
  value: Record<string, unknown>;
}

export interface DefaultBlockWithID extends DefaultBlock {
  blockId: string;
}

export interface BlocksArray<T> {
  blocks: Array<T>;
}
