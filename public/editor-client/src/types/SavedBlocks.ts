import { Response } from "./Response";

export interface Block {
  type: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  blockId: string;
  deleted?: boolean;
}

export interface FontStyle {
  deletable: "off" | "on";
  id: string;
  title: string;
  fontFamily: string;
  fontFamilyType: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  mobileFontSize: number;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;
}

export interface Palette {
  id: string;
  hex: string;
}

export interface Style {
  id: string;
  title: string;
  fontStyles: FontStyle[];
  colorPalette: Palette[];
}

export interface ExtraFontStyle extends FontStyle {
  deletable: "on";
}

export type BlockMetaType = "normal" | "popup";

interface Base {
  uid: string;
  dataVersion: number;
  title?: string;
  tags?: string;
  synchronizable?: boolean;
  synchronized?: boolean;
  isCloudEntity?: boolean;
  meta: {
    type: BlockMetaType;
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export interface SavedBlock extends Base {
  data: Block;
}

export interface SavedLayout extends Base {
  data: {
    blocks: Block[];
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}

export interface SavedBlockImport {
  success: Array<SavedBlock>;
  errors: Array<{ uid: string; message: string }>;
}

export interface SavedLayoutImport {
  success: Array<SavedLayout>;
  errors: Array<{ uid: string; message: string }>;
}

export type SavedBlockMeta = Omit<SavedBlock, "data">;
export type SavedLayoutMeta = Omit<SavedLayout, "data">;
export interface SavedBlockExtra {
  uid: string;
}

export interface CreatedSavedBlock extends SavedBlock {
  uid: string;
  media: {
    images: Array<string>;
    uploads: Array<string>;
    fonts: Array<string>;
  };
}

export interface CreateSavedBlock {
  block: CreatedSavedBlock;
  is_autosave: 0 | 1;
}

export interface CreatedSavedLayout extends SavedLayout {
  uid: string;
  media: {
    images: Array<string>;
    uploads: Array<string>;
    fonts: Array<string>;
  };
}

export interface CreateSavedLayout {
  block: CreatedSavedLayout;
  is_autosave: 0 | 1;
}

export interface SavedBlocks {
  get: (res: Response<Array<SavedBlockMeta>>, rej: Response<string>) => void;
  getByUid: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: SavedBlockExtra
  ) => void;
  create: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: CreateSavedBlock
  ) => void;
  update: (
    res: Response<SavedBlockMeta>,
    rej: Response<string>,
    extra: SavedBlockMeta
  ) => void;
  delete: (
    res: Response<SavedBlockMeta>,
    rej: Response<string>,
    extra: SavedBlockMeta
  ) => void;
  import: (res: Response<SavedBlockImport>, rej: Response<string>) => void;
}

export interface SavedLayouts {
  get: (res: Response<Array<SavedLayoutMeta>>, rej: Response<string>) => void;
  getByUid: (
    res: Response<SavedLayout>,
    rej: Response<string>,
    extra: SavedBlockExtra
  ) => void;
  create: (
    res: Response<SavedLayout>,
    rej: Response<string>,
    extra: CreateSavedLayout
  ) => void;
  update: (
    res: Response<SavedLayoutMeta>,
    rej: Response<string>,
    extra: SavedLayoutMeta
  ) => void;
  delete: (
    res: Response<SavedLayoutMeta>,
    rej: Response<string>,
    extra: SavedLayoutMeta
  ) => void;
  import: (res: Response<SavedLayoutImport>, rej: Response<string>) => void;
}

export interface SavedPopups {
  get: (res: Response<Array<SavedBlockMeta>>, rej: Response<string>) => void;
  getByUid: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: SavedBlockExtra
  ) => void;
  create: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: CreateSavedBlock
  ) => void;
  update: (
    res: Response<SavedBlockMeta>,
    rej: Response<string>,
    extra: SavedBlockMeta
  ) => void;
  delete: (
    res: Response<SavedBlockExtra>,
    rej: Response<string>,
    extra: SavedBlockExtra
  ) => void;
  import: (res: Response<SavedBlockImport>, rej: Response<string>) => void;
}
