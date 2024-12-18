import { Literal } from "@/utils/types";
import { Response } from "./Response";

interface ThumbnailWithDimensions {
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

export interface DefaultBlock {
  type: string;
  value: Record<string, unknown>;
}

export interface RegeneratedGlobalStyles<T1, T2> {
  regenerateColors: (res: Response<T1>, rej: Response<string>) => void;
  regenerateTypography: (
    res: Response<Promise<T2>>,
    rej: Response<string>
  ) => void;
  label: string;
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

export interface DefaultBlockWithID extends DefaultBlock {
  blockId: string;
}

export interface BlocksArray<T> {
  blocks: Array<T>;
}

export interface Block {
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
  kitId: string;
}

export interface BlockWithThumbs extends Block {
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
  thumbnailWidth: number;
  thumbnailHeight: number;
}

export interface TemplatePageWithThumbs extends TemplatePage {
  thumbnailSrc: string;
}

export interface Categories {
  id: number | string;
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

export interface Palette {
  id: string;
  hex: string;
}

type fontSizeUnits = "px" | "%";

export interface FontStyle {
  id: number | string;
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

export interface CustomTemplatePage extends TemplatePageWithThumbs {
  [key: string]: Literal;
}

// region Kits
export interface DefaultTemplateKits<T1, T2, T3> {
  label?: string;
  getMeta: (res: Response<T1>, rej: Response<string>, kit: KitItem) => void;
  getData: (
    res: Response<T2>,
    rej: Response<string>,
    kit: BlockWithThumbs
  ) => void;
  getKits: (res: Response<T3>, rej: Response<string>) => void;
}

export interface Kits {
  blocks: Array<Block>;
  categories: Array<Categories>;
  id: string;
  name: string;
  styles: Array<Style>;
  types: KitType[];
}

export interface KitsWithThumbs extends Omit<Kits, "blocks"> {
  blocks: Array<BlockWithThumbs>;
}

export interface Kit extends ThumbnailWithDimensions {
  categories: string;
  pro: string;
  theme: string;
  slug: string;
  keywords: string;
  blank?: string;
}

export interface KitItem {
  id: string;
  title: string;
}

export interface KitType extends KitItem {
  name: string;
  icon?: string;
}

export interface KitDataResult {
  collection: { pageData: string }[];
}

export interface KitDataItems {
  items: Array<DefaultBlock>;
}

// endregion

// region Popups
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

export interface PopupBlockWithThumbs extends PopupBlock {
  thumbnailSrc: string;
}

export interface DefaultTemplatePopup<T1, T2> {
  label?: string;
  getMeta: (res: Response<T1>, rej: Response<string>) => void;
  getData: (
    res: Response<T2>,
    rej: Response<string>,
    kit: PopupBlockWithThumbs
  ) => void;
}

export type APIPopup = {
  id: string;
  categories: string;
  blank?: string;
  order: number;
  pro: string;
  thumbnail: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
  title: string;
};

export interface Popups {
  blocks: Array<Block>;
  categories: Array<Categories>;
}

export interface PopupsWithThumbs extends Omit<Popups, "blocks"> {
  blocks: Array<PopupBlockWithThumbs>;
}

export interface PopupsResponse {
  categories: Array<{
    title: string;
    slug: string;
  }>;
  collections: APIPopup[];
}

export type PopupDataResult = Array<{
  pageData: string;
}>;
// endregion

// region Layouts
export interface LayoutsDefaultTemplate<T1, T2, T3> {
  label?: string;
  getMeta: (res: Response<T1>, rej: Response<string>) => void;
  getData: (
    res: Response<T2>,
    rej: Response<string>,
    page: CustomTemplatePage
  ) => void;
  getPages: (res: Response<T3>, rej: Response<string>, id: string) => void;
}

export interface LayoutTemplate {
  blank?: boolean;
  name: string;
  cat: Array<number | string>;
  pagesCount: number;
  layoutId: string;
  pro: boolean;
  keywords: string;
}

export interface Layouts {
  templates: Array<LayoutTemplateWithThumbs>;
  categories: Pick<Categories, "id" | "title">[];
}

export interface LayoutsPages {
  pages: CustomTemplatePage[];
  styles: Style[];
}

export interface LayoutsWithThumbs extends Omit<Layouts, "templates"> {
  templates: Array<LayoutTemplateWithThumbs>;
}

export interface LayoutTemplateWithThumbs extends LayoutTemplate {
  thumbnailSrc: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

interface LayoutsCommon {
  title: string;
  slug: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

export interface LayoutsPageAPI extends LayoutsCommon {
  thumbs: string;
}

export interface LayoutsAPI extends LayoutsCommon {
  pro: string;
  categories: string;
  pagesCount: string;
  thumbnail: string;
  keywords: string;
}

export type LayoutDataResult = Array<{ pageData: string }>;

export interface LayoutsPagesResult {
  collections: LayoutsPageAPI[];
  paginationInfo: {
    itemsPerPage: number;
    lastPage: number;
    totalCount: number;
  };
  styles: Style;
}
// endregion

// region Story Types
export interface StoriesAPI extends ThumbnailWithDimensions {
  title: string;
  categories: string;
  id: string;
  pages: number;
}

export interface StoryPages extends ThumbnailWithDimensions {
  slug: string;
}

export interface Stories {
  stories: Array<StoriesTemplate>;
  categories: Array<Omit<Categories, "slug">>;
}

export interface StoriesWithThumbs extends Omit<Stories, "stories"> {
  stories: Array<StoriesTemplateWithThumbs>;
}

export interface StoriesTemplate {
  blank?: boolean;
  layoutId: string;
  name: string;
  cat: Array<Literal>;
  pagesCount: number;
  styles?: Array<Style>;
}

export interface StoriesTemplateWithThumbs extends StoriesTemplate {
  thumbnailSrc: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

export interface StoryDataResponse {
  collection: string;
}

export interface StoryPagesResult {
  collections: StoryPages[];
  paginationInfo: {
    itemsPerPage: number;
    lastPage: number;
    totalCount: number;
  };
  styles: Style;
}
// endregion
