import { Style } from "../Project/Style";
import { Response } from "../common";
import { Literal } from "../common";
import { BlocksArray, Categories, DefaultBlock } from "../common/Block";

interface StoriesTemplate {
  layoutId: string;
  name: string;
  cat: Array<Literal>;
  pagesCount: number;
  thumbnailSrc: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  blank?: boolean;
  styles?: Array<Style>;
}

interface StoriesMeta {
  stories: Array<StoriesTemplate>;
  categories: Array<Omit<Categories, "slug">>;
}

interface TemplatePage {
  id: string;
  title: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailSrc: string;
  [key: string]: Literal;
}

interface LayoutsPages {
  pages: TemplatePage[];
  styles: Style[];
}

export interface DefaultStories {
  getMeta: (res: Response<StoriesMeta>, rej: Response<string>) => void;
  getData: (
    res: Response<BlocksArray<DefaultBlock>>,
    rej: Response<string>,
    page: { id: string; layoutId: string }
  ) => void;
  getPages: (
    res: Response<LayoutsPages>,
    rej: Response<string>,
    id: string
  ) => void;
}
