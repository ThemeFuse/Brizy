import { Response } from "./Response";
import { NewType } from "./NewType";

//#region Position

export interface Position {
  align: "top" | "bottom";
  top: number;
  bottom: number;
}

//#endregion

//#region Rules

//#endregion

//#region Base

export enum BlockTypeRule {
  include = 1,
  exclude = 2
}

export interface AllRule {
  type: BlockTypeRule;
}

export interface CollectionTypeRule extends AllRule {
  appliedFor: number;
  entityType: string;
}

export type WPReferenceAllAuthor = NewType<string, "author|">;

export type WPReferenceSpecificAuthor = NewType<string, "author|id">;

export type WPReferenceAuthorEntity =
  | WPReferenceAllAuthor
  | WPReferenceSpecificAuthor;

export type WPReferenceAllInEntity = NewType<string, "in|taxonomy|">;

export type WPReferenceSpecificInEntity = NewType<string, "in|taxonomy|id">;

export type WPReferenceInEntity =
  | WPReferenceAllInEntity
  | WPReferenceSpecificInEntity;

export type WPReferenceChildEntity = NewType<string, "child|postId">;

export type WPReference =
  | WPReferenceAuthorEntity
  | WPReferenceInEntity
  | WPReferenceChildEntity
  | number;

export interface CollectionItemRule extends AllRule {
  appliedFor: number | null;
  entityType: string;
  mode: "reference" | "specific";
  entityValues: Array<WPReference>;
}

export type Rule = AllRule | CollectionTypeRule | CollectionItemRule;

interface GlobalBlockBase {
  id: string;
  data: Record<string, undefined>;
  status: "draft" | "publish";
  rules: Array<Rule>;
  position: Position | null;
  dataVersion: number;
  dependencies: Array<string>;
  title?: string;
  tags?: string;
}

//#endregion

//#region GlobalBlocks

export interface GlobalBlockNormal extends GlobalBlockBase {
  meta: {
    type: "normal";
    extraFontStyles: Array<unknown>;
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export interface GlobalBlock {
  get?: (
    res: Response<Array<GlobalBlockNormal>>,
    rej: Response<string>
  ) => void;
  getByRules?: (
    res: Response<Array<GlobalBlockNormal>>,
    rej: Response<string>,
    extra: Array<Rule>
  ) => void;
  create?: (
    res: Response<GlobalBlockNormal>,
    rej: Response<string>,
    extra: GlobalBlockNormal
  ) => void;
  update?: (
    res: Response<GlobalBlockNormal>,
    rej: Response<string>,
    extra: GlobalBlockNormal
  ) => void;
  updateBulk?: (
    res: Response<Array<GlobalBlockNormal>>,
    rej: Response<string>,
    extra: Array<GlobalBlockNormal>
  ) => void;
  delete?: () => void;
}

//#endregion

//#region GlobalPopups

export interface GlobalBlockPopup extends GlobalBlockBase {
  meta: {
    type: "popup";
    extraFontStyles: Array<unknown>;
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export interface GlobalPopup {
  get?: (res: Response<Array<GlobalBlockPopup>>, rej: Response<string>) => void;
  getByRules?: (
    res: Response<Array<GlobalBlockPopup>>,
    rej: Response<string>,
    extra: Array<Rule>
  ) => void;
  create?: (
    res: Response<GlobalBlockPopup>,
    rej: Response<string>,
    extra: GlobalBlockPopup
  ) => void;
  update?: (
    res: Response<GlobalBlockPopup>,
    rej: Response<string>,
    extra: GlobalBlockPopup
  ) => void;
  updateBulk?: (
    res: Response<Array<GlobalBlockPopup>>,
    rej: Response<string>,
    extra: Array<GlobalBlockPopup>
  ) => void;
  delete?: () => void;
}

//#endregion
