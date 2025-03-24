import { NewType } from "./NewType";

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

export type ReferenceAllAuthor = NewType<string, "author|">;

export type ReferenceSpecificAuthor = NewType<string, "author|id">;

export type ReferenceAuthorEntity =
  | ReferenceAllAuthor
  | ReferenceSpecificAuthor;

export type ReferenceAllInEntity = NewType<string, "in|taxonomy|">;

export type ReferenceSpecificInEntity = NewType<string, "in|taxonomy|id">;

export type ReferenceInEntity =
  | ReferenceAllInEntity
  | ReferenceSpecificInEntity;

export type ReferenceChildEntity = NewType<string, "child|postId">;

export type Reference =
  | ReferenceAuthorEntity
  | ReferenceInEntity
  | ReferenceChildEntity
  | number;

export type EntityTypeRule = Reference;

export interface CollectionItemRule extends AllRule {
  appliedFor: number | null;
  entityType: string;
  mode: "reference" | "specific";
  entityValues: Array<string | number>;
}

export interface ApiCollectionItemRule {
  mode?: "reference" | "specific";
  type: 1 | 2;
  appliedFor: number | null;
  entityType: string;
  entityValues: Array<string | number>;
}

export interface ApiCollectionTypeRule {
  type: 1 | 2;
  appliedFor: number;
  entityType: string;
  entityValues: [];
}

export interface ApiAllRule {
  type: 1 | 2;
  appliedFor: null;
  entityType: "";
  entityValues: string[];
}

export type ApiRule =
  | ApiCollectionItemRule
  | ApiCollectionTypeRule
  | ApiAllRule;

export type Rule = AllRule | CollectionTypeRule | CollectionItemRule;
