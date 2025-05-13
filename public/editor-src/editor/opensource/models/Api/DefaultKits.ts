import { Style } from "../Project/Style";
import { Literal, Response } from "../common";
import { Block, Categories } from "../common/Block";

interface BlockWithThumbs extends Block {
  thumbnailSrc: string;
}

interface Type {
  id: Literal;
  name: string;
  title: string;
  icon: string;
}

interface KitsThumbs {
  blocks: Array<BlockWithThumbs>;
  categories: Array<Categories>;
  id: string;
  name: string;
  styles: Array<Style>;
  types: Array<Type>;
}

export type KitItem = {
  id: string;
  title: string;
};

export interface DefaultKits {
  label?: string;
  getKits: (res: Response<Array<KitItem>>, rej: Response<string>) => void;
  getMeta: (
    res: Response<KitsThumbs>,
    rej: Response<string>,
    kit: KitItem
  ) => void;
  getData: (
    res: Response<Record<string, unknown>>,
    rej: Response<string>,
    kit: BlockWithThumbs
  ) => void;
}
