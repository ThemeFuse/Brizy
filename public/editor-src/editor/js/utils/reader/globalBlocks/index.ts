import { Arr, Json, Num, Obj, Str } from "@brizy/readers";
import { match, mPipe, optional, parseStrict } from "fp-utilities";
import type { BlockHtmlWithId } from "visual/types/Block";
import type { GlobalBlock, GlobalBlockBase } from "visual/types/GlobalBlock";
import type {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  Rule as GlobalBlockRule
} from "visual/types/Rule";
import type { ArrayType } from "visual/utils/array/types";
import { pipe } from "visual/utils/fp";
import { type MValue, onNullish, throwOnNullish } from "visual/utils/value";
import * as Union from "../union";
import { type GlobalBlockMetaInput, globalBlockMetaSchema } from "./schemas";

//#region Global Blocks Rules

interface ApiCollectionItemRule {
  mode?: "reference" | "specific";
  type: 1 | 2;
  appliedFor: number | null;
  entityType: string;
  entityValues: Array<string | number>;
}

interface ApiCollectionTypeRule {
  type: 1 | 2;
  appliedFor: number;
  entityType: string;
  entityValues: [];
}

interface ApiAllRule {
  type: 1 | 2;
  appliedFor: null;
  entityType: "";
  entityValues: string[];
}

export type ApiRule =
  | ApiCollectionItemRule
  | ApiCollectionTypeRule
  | ApiAllRule;

const isApiItemRule = (rule: ApiRule): rule is ApiCollectionItemRule => {
  return "entityValues" in rule && rule.entityValues.length > 0;
};

const isApiTypeRule = (rule: ApiRule): rule is ApiCollectionTypeRule => {
  return (
    "appliedFor" in rule &&
    rule.appliedFor !== null &&
    "entityValues" in rule &&
    rule.entityValues.length === 0 &&
    rule.entityType !== undefined
  );
};

const isApiAllRule = (rule: ApiRule): rule is ApiAllRule => {
  return (
    "appliedFor" in rule &&
    rule.appliedFor === null &&
    (rule.entityType === "" || rule.entityType === undefined)
  );
};

const matches = match(
  [
    isApiItemRule,
    (rule: ApiCollectionItemRule): CollectionItemRule => {
      return {
        mode: rule.mode ?? "specific",
        type: rule.type,
        appliedFor: rule.appliedFor,
        entityType: rule.entityType,
        entityValues: rule.entityValues
      };
    }
  ],
  [
    isApiTypeRule,
    (rule: ApiCollectionTypeRule): CollectionTypeRule => {
      return {
        type: rule.type,
        appliedFor: rule.appliedFor,
        entityType: rule.entityType
      };
    }
  ],
  [
    isApiAllRule,
    (rule: ApiAllRule): AllRule => {
      return {
        type: rule.type
      };
    }
  ]
);

export const apiRuleToEditorRule = (v: unknown): MValue<GlobalBlockRule> => {
  const rule = Obj.read(v);

  if (rule) {
    return matches(rule as unknown as ApiRule);
  }

  return undefined;
};

//#endregion

//#region Parse GlobalBlock

type GBData = GlobalBlock["data"];
type GBMeta = GlobalBlock["meta"];
type GBPosition = GlobalBlock["position"];
type GBStatus = GlobalBlock["status"];
type GBRules = GlobalBlock["rules"];
type GBDependency = ArrayType<GlobalBlock["dependencies"]>;
type GBBlocks = GlobalBlock["blocks"];

// `rest` is spread whole: a key the target variant does not declare (e.g. a
// `subtype` on a normal block) is kept, as the previous reader kept it, because
// this meta is written back to the API on save.
const toMeta = ({ type, ...rest }: GlobalBlockMetaInput): GBMeta => {
  switch (type) {
    case "normal":
      return { type, ...rest };
    case "popup":
      return { type, ...rest };
    case "overlay":
      return { type, ...rest, subtype: rest.subtype };
  }
};

const readMeta = (v: Record<string, unknown>): GBMeta => {
  const meta = pipe(
    mPipe(Obj.readKey("meta"), Json.read, Obj.read),
    throwOnNullish("meta")
  )(v);

  // Obj.read lets arrays through: an empty meta stored as "[]" (PHP's
  // json_encode of an empty array) reads as a meta with every default.
  return toMeta(globalBlockMetaSchema.parse(Array.isArray(meta) ? {} : meta));
};

const parseBlocks = (v: unknown): MValue<BlockHtmlWithId> => {
  const b = Obj.read(v);

  if (b && Str.is(b.id) && Str.is(b.html)) {
    // @ts-expect-error: Type 'string' is not assignable to type '""'.
    return {
      id: b.id,
      html: b.html
    };
  }

  return undefined;
};

export const parseGlobalBlock = (
  globalBlock: Record<string, unknown>
): MValue<GlobalBlock> => {
  // Parsed against one flat shape: the GlobalBlock union makes parseStrict
  // expect a reader per variant, which no single `meta` reader can satisfy.
  const reader = parseStrict<
    Record<string, unknown>,
    GlobalBlockBase & { meta: GBMeta }
  >({
    uid: pipe(mPipe(Obj.readKey("uid"), Str.read), throwOnNullish("uid")),
    title: optional(pipe(Obj.readKey("title"), Str.read)),
    data: pipe(
      mPipe(Obj.readKey("data"), Obj.read as () => MValue<GBData>),
      throwOnNullish("data")
    ),
    dataVersion: pipe(Obj.readKey("dataVersion"), Num.read, onNullish(0)),
    meta: readMeta,
    // @ts-expect-error: Type null is not assignable to type undefined
    position: optional(
      pipe(
        Obj.readKey("position"),
        Obj.read as () => MValue<GBPosition>,
        onNullish(null as GBPosition)
      )
    ),
    status: pipe(
      Obj.readKey("status"),
      Union.readWithChoices(["draft", "publish"]),
      onNullish("publish") as () => GBStatus
    ),
    rules: pipe(
      Obj.readKey("rules"),
      Arr.readWithItemReader(apiRuleToEditorRule),
      onNullish([] as GBRules)
    ),
    tags: optional(pipe(Obj.readKey("tags"), Str.read)),
    dependencies: pipe(
      Obj.readKey("dependencies"),
      Arr.readWithItemReader(Str.read),
      onNullish([] as Array<GBDependency>)
    ),
    blocks: optional(
      mPipe(
        Obj.readKey("blocks"),
        Arr.readWithItemReader(parseBlocks),
        onNullish([] as GBBlocks)
      )
    )
  });

  try {
    const { meta, ...base } = reader(globalBlock);

    // Rebuilds the union member: a `meta` union does not make the whole
    // object a GlobalBlock until it is narrowed on its discriminant.
    switch (meta.type) {
      case "normal":
        return { ...base, meta };
      case "popup":
        return { ...base, meta };
      case "overlay":
        return { ...base, meta };
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

//#endregion

//#region Parse GlobalBlocks

export interface BlockRecord {
  [key: string]: GlobalBlock;
}

export const parseGlobalBlocksToRecord = (block: unknown): BlockRecord => {
  const blocks = Arr.read(block);
  const output: BlockRecord = {};

  if (!blocks || blocks.length === 0) {
    return output;
  }

  blocks.forEach((block) => {
    const data = Obj.read(block);

    if (!data) {
      return;
    }

    const globalBlock = parseGlobalBlock(data);

    if (globalBlock) {
      output[globalBlock.uid] = globalBlock;
    }
  });

  return output;
};

//#endregion
