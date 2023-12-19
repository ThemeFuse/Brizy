import { SavedBlock, SavedLayout } from "visual/types";
import { Response } from "../common";

//#region Base Saved Block

type SyncBlock<T> = T & {
  synchronizable: boolean;
  synchronized: boolean;
  isCloudEntity: boolean;
};
type WithUid<T> = T & { uid: string };
type Filters = Array<{ id: string; label: string }>;

//#endregion

//#region Saved Block

export type SavedBlockAPI = SyncBlock<WithUid<SavedBlock>>;
export type SavedBlockAPIMeta = Omit<SavedBlockAPI, "data">;
export interface SavedBlockExtra {
  uid: string;
}
export type UpdateSavedBlock = WithUid<
  Pick<SavedBlock, "dataVersion" | "tags" | "title">
>;
export type DeleteSavedBlock = WithUid<Pick<SavedBlock, "dataVersion">>;

export interface SavedBlockImport {
  success: Array<WithUid<SavedBlock>>;
  errors: Array<{ uid: string; message: string }>;
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
  is_autosave: 1 | 0;
}

export type SavedBlockFilter = Filters;

export interface APISavedBlocks {
  get?: (
    res: Response<Array<SavedBlockAPIMeta>>,
    rej: Response<string>,
    extra?: { filterBy: string }
  ) => void;
  getByUid?: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: SavedBlockExtra
  ) => void;
  create?: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: CreateSavedBlock
  ) => void;
  update?: (
    res: Response<UpdateSavedBlock>,
    rej: Response<string>,
    extra: UpdateSavedBlock
  ) => void;
  delete?: (
    res: Response<DeleteSavedBlock>,
    rej: Response<string>,
    extra: DeleteSavedBlock
  ) => void;
  import?: (res: Response<SavedBlockImport>, rej: Response<string>) => void;
  filter?: {
    label?: string;
    defaultSelected?: string;
    handler: (res: Response<SavedBlockFilter>, ref: Response<string>) => void;
  };
}

//#endregion

//#region Saved Layout

type SavedLayoutAPI = SyncBlock<WithUid<SavedLayout>>;
export type SavedLayoutAPIMeta = Omit<SavedLayoutAPI, "data">;
export type UpdateSavedLayout = WithUid<
  Pick<SavedLayout, "dataVersion" | "tags" | "title">
>;
export type DeleteSavedLayout = WithUid<Pick<SavedLayout, "dataVersion">>;

export interface SavedLayoutImport {
  success: Array<WithUid<SavedLayout>>;
  errors: Array<{ uid: string; message: string }>;
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
  is_autosave: 1 | 0;
}

export type SavedLayoutFilter = Filters;

export interface APISavedLayouts {
  get?: (
    res: Response<Array<SavedLayoutAPIMeta>>,
    rej: Response<string>,
    extra?: { filterBy: string }
  ) => void;
  getByUid?: (
    res: Response<SavedLayout>,
    rej: Response<string>,
    extra: SavedBlockExtra
  ) => void;
  create?: (
    res: Response<SavedLayout>,
    rej: Response<string>,
    extra: CreateSavedLayout
  ) => void;
  update?: (
    res: Response<UpdateSavedLayout>,
    rej: Response<string>,
    extra: UpdateSavedLayout
  ) => void;
  delete?: (
    res: Response<DeleteSavedLayout>,
    rej: Response<string>,
    extra: DeleteSavedLayout
  ) => void;
  import?: (res: Response<SavedLayoutImport>, rej: Response<string>) => void;
  filter?: {
    label?: string;
    defaultSelected?: string;
    handler: (res: Response<SavedLayoutFilter>, ref: Response<string>) => void;
  };
}

//#endregion

//#region Saved Popups

export interface APISavedPopups {
  get?: (
    res: Response<Array<SavedBlockAPIMeta>>,
    rej: Response<string>,
    extra?: { filterBy: string }
  ) => void;
  getByUid?: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: SavedBlockExtra
  ) => void;
  create?: (
    res: Response<SavedBlock>,
    rej: Response<string>,
    extra: CreateSavedBlock
  ) => void;
  update?: (
    res: Response<UpdateSavedBlock>,
    rej: Response<string>,
    extra: UpdateSavedBlock
  ) => void;
  delete?: (
    res: Response<DeleteSavedBlock>,
    rej: Response<string>,
    extra: DeleteSavedBlock
  ) => void;
  import?: (res: Response<SavedBlockImport>, rej: Response<string>) => void;
  filter?: {
    label?: string;
    defaultSelected?: string;
    handler: (res: Response<SavedBlockFilter>, ref: Response<string>) => void;
  };
}

//#endregion
