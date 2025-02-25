import { EcwidCategoryId, EcwidProductId } from "visual/global/Ecwid/types";
import { NewType } from "visual/types/NewType";

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

export type CloudReferenceEntity = NewType<string, "reference">;

export type CloudReferenceAllEntity = NewType<string, "allReference">;

export type CloudReference =
  | CloudReferenceEntity
  | CloudReferenceAllEntity
  | string;

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

export type EntityTypeRule =
  | CloudReference
  | WPReference
  | EcwidProductId
  | EcwidCategoryId;

export interface CollectionItemRule extends AllRule {
  appliedFor: number | null;
  entityType: string;
  mode: "reference" | "specific";
  entityValues: Array<EntityTypeRule>;
}

export type Rule = AllRule | CollectionTypeRule | CollectionItemRule;
