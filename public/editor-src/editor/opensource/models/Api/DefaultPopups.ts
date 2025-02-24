import { Literal, Response } from "../common";
import { DefaultBlockWithID } from "../common/Block";
import { KitItem } from "./DefaultKits";

export interface PopupBlock {
  id: string;
  cat: Array<Literal>;
  title: string;
  keywords: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  type: Array<Literal>;
  blank?: string;
  position?: number;
  pro?: boolean;
}

interface PopupCategory {
  id: string;
  slug: string;
  title: string;
}

export interface Popup {
  blocks: Array<PopupBlock>;
  categories: Array<PopupCategory>;
}

export interface DefaultPopups {
  label?: string;
  getMeta: (res: Response<Popup>, rej: Response<string>) => void;
  getData: (
    res: Response<DefaultBlockWithID>,
    rej: Response<string>,
    kit: KitItem
  ) => void;
}
