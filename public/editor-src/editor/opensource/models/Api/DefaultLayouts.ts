import { Style } from "../Project/Style";
import { Literal, Response } from "../common";
import { BlocksArray, Categories, DefaultBlockWithID } from "../common/Block";

interface TemplatePage {
  id: string;
  title: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailSrc: string;

  [key: string]: Literal;
}

interface LayoutTemplate {
  name: string;
  cat: Array<Literal>;
  pagesCount: number;
  pro: boolean;
  keywords: string;
  thumbnailSrc: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  blank?: boolean;
}

interface LayoutsMeta {
  categories: Pick<Categories, "id" | "title">[];
  templates: Array<LayoutTemplate>;
}

interface LayoutsPages {
  pages: TemplatePage[];
  styles: Style[];
}

export interface DefaultLayouts {
  getMeta: (res: Response<LayoutsMeta>, rej: Response<string>) => void;
  getData: (
    res: Response<BlocksArray<DefaultBlockWithID>>,
    rej: Response<string>,
    page: { id: string; layoutId: string }
  ) => void;
  getPages: (
    res: Response<LayoutsPages>,
    rej: Response<string>,
    id: string
  ) => void;
}
