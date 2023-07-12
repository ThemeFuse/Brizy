import { Response } from "./Response";

export interface DefaultBlock {
  type: string;
  value: Record<string, unknown>;
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

export interface Kits {
  blocks: Array<Block>;
  categories: Array<Categories>;
  id: string;
  name: string;
  styles: Array<Style>;
  types: Array<Record<string, unknown>>;
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
}

interface BlockWithThumbs extends Block {
  thumbnailSrc: string;
}

export interface Template {
  blank?: boolean;
  name: string;
  cat: Array<number>;
  color: string;
  pages: Array<TemplatePage>;
  styles?: Array<Style>;
}

export interface TemplateWithThumbs extends Omit<Template, "pages"> {
  pages: Array<TemplatePageWithThumbs>;
  thumbnailSrc: string;
}

export interface TemplatePage {
  id: string;
  title: string;
  keywords: string;
  cat: Array<number>;
  thumbnailWidth: number;
  thumbnailHeight: number;
  pro: boolean;
}

export interface TemplatePageWithThumbs extends TemplatePage {
  thumbnailSrc: string;
}

interface Categories {
  id: number;
  slug: string;
  title: string;
  hidden?: boolean;
}

interface Style {
  id: string;
  title: string;
  colorPalette: Array<Palette>;
  fontStyles: Array<FontStyle>;
}

interface Palette {
  id: string;
  hex: string;
}

type fontSizeUnits = "px" | "%";

interface FontStyle {
  id: number;
  title: string;
  deletable: "on" | "off";
  fontFamily: string;
  fontFamilyType: string;
  fontSize: number;
  fontSizeSuffix?: fontSizeUnits;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  mobileFontSize: number;
  mobileFontSizeSuffix?: fontSizeUnits;
  mobileFontWeight: number;
  mobileLetterSpacing: number;
  mobileLineHeight: number;
  tabletFontSize: number;
  tabletFontSizeSuffix?: fontSizeUnits;
  tabletFontWeight: number;
  tabletLetterSpacing: number;
  tabletLineHeight: number;
}
