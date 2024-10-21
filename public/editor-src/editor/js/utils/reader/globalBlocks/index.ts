import { mPipe, match, parseStrict } from "fp-utilities";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  GlobalBlock,
  Rule as GlobalBlockRule
} from "visual/types";
import { pipe } from "visual/utils/fp";
import { optional } from "visual/utils/reader/readWithParser";
import { MValue, onNullish, throwOnNullish } from "visual/utils/value";
import * as Arr from "../array";
import * as Json from "../json";
import * as Num from "../number";
import * as Obj from "../object";
import * as Str from "../string";
import * as Union from "../union";
import { ArrayType } from "visual/utils/array/types";

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

const parseMeta = parseStrict<Record<string, unknown>, GBMeta>({
  // @ts-expect-error: Type "normal" | "popup" is not assignable to type "normal
  type: pipe(
    Obj.readKey("type"),
    Union.readWithChoices(["popup", "normal"]),
    onNullish("normal")
  ),
  extraFontStyles: pipe(
    Obj.readKey("extraFontStyles"),
    Arr.read as () => GBMeta["extraFontStyles"],
    onNullish([] as GBMeta["extraFontStyles"])
  ),
  _thumbnailSrc: optional(pipe(Obj.readKey("_thumbnailSrc"), Str.read)),
  _thumbnailWidth: optional(pipe(Obj.readKey("_thumbnailWidth"), Num.read)),
  _thumbnailHeight: optional(pipe(Obj.readKey("_thumbnailHeight"), Num.read)),
  _thumbnailTime: optional(pipe(Obj.readKey("_thumbnailTime"), Num.read))
});

export const parseGlobalBlock = (
  globalBlock: Record<string, unknown>
): MValue<GlobalBlock> => {
  const reader = parseStrict<Record<string, unknown>, GlobalBlock>({
    uid: pipe(mPipe(Obj.readKey("uid"), Str.read), throwOnNullish("uid")),
    data: pipe(
      mPipe(Obj.readKey("data"), Obj.read as () => MValue<GBData>),
      throwOnNullish("data")
    ),
    dataVersion: pipe(Obj.readKey("dataVersion"), Num.read, onNullish(0)),
    // @ts-expect-error: Type '"popup"' is not assignable to type '"normal"'
    meta: pipe(
      mPipe(Obj.readKey("meta"), Json.read, Obj.read, parseMeta),
      throwOnNullish("meta")
    ),
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
    dependencies: pipe(
      Obj.readKey("dependencies"),
      Arr.readWithItemReader(Str.read),
      onNullish([] as Array<GBDependency>)
    )
  });

  try {
    return reader(globalBlock);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

//#endregion

//#region Parse GlobalBlocks

interface BlockRecord {
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
      const {
        status,
        meta,
        uid,
        data,
        dataVersion,
        rules,
        position,
        dependencies
      } = globalBlock;
      switch (meta.type) {
        case "popup": {
          output[uid] = {
            uid,
            data,
            dataVersion,
            status,
            meta,
            rules,
            position,
            dependencies
          };
          break;
        }
        case "normal": {
          output[uid] = {
            uid,
            data,
            dataVersion,
            status,
            meta,
            rules,
            position,
            dependencies
          };
          break;
        }
      }
    }
  });

  return output;
};

//#endregion
