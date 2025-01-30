import { ElementModelType } from "visual/component/Elements/Types";
import { Palette, FontStyle as _FontStyle } from "visual/types/Style";
import { Literal } from "visual/utils/types/Literal";
import { Response } from "../common";

export interface DefaultBlock extends ElementModelType {
  deleted?: boolean;
}

export interface DefaultTemplate<T1, T2> {
  label?: string;
  getMeta: (res: Response<T1>, rej: Response<string>) => void;
  getData: (
    res: Response<Promise<T2>>,
    rej: Response<string>,
    blockID: string
  ) => void;
}

export interface DefaultTemplateKits<T1, T2, T3> {
  label?: string;
  getMeta: (res: Response<T1>, rej: Response<string>, id: string) => void;
  getData: (
    res: Response<Promise<T2>>,
    rej: Response<string>,
    kit: BlockWithThumbs
  ) => void;
  getKits: (res: Response<T3>, rej: Response<string>) => void;
}

export interface DefaultTemplateWithPages<T1, T2, T3> {
  label?: string;
  getMeta: (res: Response<T1>, rej: Response<string>) => void;
  getData: (
    res: Response<Promise<T2>>,
    rej: Response<string>,
    page: CustomTemplatePage
  ) => void;
  getPages: (res: Response<T3>, rej: Response<string>, id: string) => void;
}

export interface Kits {
  blocks: Array<Block>;
  categories: Array<Categories>;
  id: string;
  name: string;
  styles: Array<Style>;
  types: Array<Record<string, unknown>>;
}

export interface KitItem {
  id: string;
  title: string;
}

export interface KitsWithThumbs extends Omit<Kits, "blocks"> {
  blocks: Array<BlockWithThumbs>;
}

export interface Popups {
  blocks: Array<Block>;
  categories: Array<Categories>;
}

export interface PopupsWithThumbs extends Omit<Popups, "blocks"> {
  blocks: Array<BlockWithThumbs>;
}

export interface Layouts {
  templates: Array<Template>;
  categories: Pick<Categories, "id" | "title">;
}

export interface DefaultBlockWithID extends DefaultBlock {
  blockId: string;
}

export interface BlocksArray<T> {
  blocks: Array<T>;
}

export interface LayoutsWithThumbs extends Omit<Layouts, "templates"> {
  templates: Array<TemplateWithThumbs>;
}

export interface LayoutsPages {
  pages: CustomTemplatePage[];
  styles: Style[];
}

export interface Stories {
  stories: Array<Template>;
  categories: Array<Omit<Categories, "slug">>;
}

export interface StoriesWithThumbs extends Omit<Stories, "stories"> {
  stories: Array<TemplateWithThumbs>;
}

interface Block {
  id: string;
  cat: Array<number>;
  title: string;
  keywords: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  type: number;
  blank?: string;
  position?: number;
  pro?: boolean;
  kitId: string;
}

export interface BlockWithThumbs extends Block {
  thumbnailSrc: string;
}

export interface Template {
  blank?: boolean;
  name: string;
  cat: Array<Literal>;
  color: string;
  pagesCount: number;
  layoutId: string;
  styles?: Array<Style>;
  pro: boolean;
  keywords: string;
}

export interface TemplateWithThumbs extends Template {
  thumbnailSrc: string;
}

export interface TemplateWithThumbsAndPages extends TemplateWithThumbs {
  pages: Array<CustomTemplatePage>;
}

export interface TemplatePage {
  id: string;
  title: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

export interface TemplatePageWithThumbs extends TemplatePage {
  thumbnailSrc: string;
}

export type CustomTemplatePage = TemplatePageWithThumbs & {
  [key: string]: string;
};

interface Categories {
  id: number;
  slug: string;
  title: string;
  hidden?: boolean;
}

export interface Style {
  id: string;
  title: string;
  colorPalette: Array<Palette>;
  fontStyles: Array<FontStyle>;
}

interface FontStyle extends _FontStyle {
  fontSizeSuffix?: fontSizeUnits;
  mobileFontSizeSuffix?: fontSizeUnits;
  tabletFontSizeSuffix?: fontSizeUnits;
}

type fontSizeUnits = "px" | "%";
