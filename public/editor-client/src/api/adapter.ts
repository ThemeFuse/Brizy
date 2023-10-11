import { match, mPipe, parseStrict } from "fp-utilities";
import { Config } from "../config";
import { Page } from "../types/Page";
import { Project } from "../types/Project";
import {
  CreatedSavedBlock,
  CreatedSavedLayout,
  CreateSavedBlock,
  CreateSavedLayout,
  SavedBlock,
  SavedBlockMeta,
  SavedLayout
} from "../types/SavedBlocks";
import { t } from "../utils/i18n";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  GlobalBlockNormal,
  GlobalBlockPopup,
  Rule
} from "../types/GlobalBlocks";
import { pipe } from "../utils/fp/pipe";
import { throwOnNullish } from "../utils/throwOnNullish";
import { onNullish } from "../utils/onNullish";
import { MValue } from "../utils/types";
import * as Obj from "../utils/reader/object";
import * as Json from "../utils/reader/json";
import * as Num from "../utils/reader/number";
import * as Str from "../utils/reader/string";
import * as Union from "../utils/reader/union";
import * as Arr from "../utils/reader/array";
import { APIGlobalBlock } from "./index";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "../utils/guards";

//#region Saved Blocks

export interface SavedBlockFromApi {
  id: string;
  uid: string;
  dataVersion: number;
  data?: string;
  title?: string;
  tags?: string;
  meta?: string;
  synchronizable?: boolean;
  synchronized?: boolean;
  isCloudEntity?: boolean;
}

export interface SavedBlockMetaFromApi {
  id: string;
  uid: string;
  meta?: string;
  title?: string;
  tags?: string;
  dataVersion: number;
  synchronizable: boolean;
  synchronized: boolean;
  isCloudEntity: boolean;
}

export type ParsedSavedBlockApi = Omit<SavedBlockFromApi, "data" | "meta"> & {
  data: SavedBlock["data"] & unknown;
  meta: SavedBlock["meta"] & unknown;
};

export type ParsedSavedLayoutApi = Omit<SavedBlockFromApi, "data" | "meta"> & {
  data: SavedLayout["data"] & unknown;
  meta: SavedLayout["meta"] & unknown;
};

type SavedBlockToApi = Omit<CreatedSavedBlock, "data" | "meta" | "media"> & {
  uid: string;
  data: string;
  meta: string;
  media: string;
};

type SavedLayoutToApi = Omit<CreatedSavedLayout, "data" | "meta" | "media"> & {
  uid: string;
  data: string;
  meta: string;
  media: string;
};

export const stringifySavedBlock = <
  T extends CreateSavedBlock | CreateSavedLayout
>(
  block: T
): SavedBlockToApi | SavedLayoutToApi => {
  const data = JSON.stringify(block.block.data);
  const meta = JSON.stringify(block.block.meta);
  const media = JSON.stringify(block.block.media);

  return { ...block.block, data, meta, media };
};

export const parseMetaSavedBlock = (
  savedBlock: SavedBlockMetaFromApi
): SavedBlockMeta => {
  let meta;
  const title = savedBlock.title ?? "";
  let tags = savedBlock.tags ?? "";

  if (!savedBlock.meta) {
    meta = {};
  } else {
    try {
      meta = JSON.parse(savedBlock.meta);
    } catch (e) {
      meta = {};
    }
  }

  if (tags === ",") {
    tags = "";
  }

  return { ...savedBlock, meta, title, tags };
};

export const parseSavedBlock = (
  savedBlock: SavedBlockFromApi
): ParsedSavedBlockApi => {
  let data;
  let meta;

  if (!savedBlock.data) {
    throw t("savedBlock data should exist");
  } else {
    try {
      data = JSON.parse(savedBlock.data);
    } catch (e) {
      throw `Failed to parse savedBlock data ${savedBlock.data}`;
    }
  }

  if (!savedBlock.meta) {
    meta = {};
  } else {
    try {
      meta = JSON.parse(savedBlock.meta);
    } catch (e) {
      meta = {};
    }
  }

  return { ...savedBlock, data, meta };
};

//#endregion

//#region SavedLayouts

export const parseSavedLayout = (
  savedLayout: SavedBlockFromApi
): ParsedSavedLayoutApi => {
  let data;
  let meta;

  if (!savedLayout.data) {
    throw t("savedLayout data should exist");
  } else {
    try {
      data = JSON.parse(savedLayout.data);
    } catch (e) {
      throw `Failed to parse savedLayout data ${savedLayout.data}`;
    }
  }

  if (!savedLayout.meta) {
    meta = {};
  } else {
    try {
      meta = JSON.parse(savedLayout.meta);
    } catch (e) {
      meta = {};
    }
  }

  return { ...savedLayout, data, meta };
};

//#endregion

//#region Project

type APIProject = Omit<Project, "data" | "dataVersion"> & {
  data: string;
  dataVersion: string;
};

export const stringifyProject = (project: Project): APIProject => ({
  ...project,
  data: JSON.stringify(project.data),
  dataVersion: `${project.dataVersion}`
});

//#endregion

//#region Collections

export type GetCollections = (
  data: {
    search?: string;
    postType?: string[];
    abortSignal?: AbortSignal;
  },
  config: Config
) => Promise<{ ID: number; title: string; permalink: string }[]>;

//#endregion

//#region Page

type APIPage = Omit<Page, "data" | "dataVersion"> & {
  data: string;
  dataVersion: string;
};

export const stringifyPage = (page: Page): APIPage => ({
  ...page,
  data: JSON.stringify(page.data),
  dataVersion: `${page.dataVersion}`
});

//#endregion

//#region Global Blocks Rules

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

export const apiRuleToEditorRule: (v: ApiRule) => Rule = match(
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

export const editorRuleToApiRule: (v: Rule) => ApiRule = match(
  [
    isCollectionItemRule,
    (rule: CollectionItemRule): ApiCollectionItemRule => {
      return {
        type: rule.type,
        appliedFor: rule.appliedFor,
        entityType: rule.entityType,
        entityValues: rule.entityValues
      };
    }
  ],
  [
    isCollectionTypeRule,
    (rule: CollectionTypeRule): ApiCollectionTypeRule => {
      return {
        type: rule.type,
        appliedFor: rule.appliedFor,
        entityType: rule.entityType,
        entityValues: []
      };
    }
  ],
  [
    isAllRule,
    (rule: AllRule): ApiAllRule => {
      return {
        type: rule.type,
        appliedFor: null,
        entityType: "",
        entityValues: []
      };
    }
  ]
);

//#endregion

//#region GlobalBlocks

type GB = GlobalBlockNormal | GlobalBlockPopup;
type GBData = GB["data"];
type GBMeta = GB["meta"];
type GBPosition = GB["position"];
type GBStatus = GB["status"];
type GBRules = GB["rules"];
type GBDependencies = GB["dependencies"];

export const parseGlobalBlock = (
  globalBlock: Record<string, unknown>
): MValue<GB> => {
  const reader = parseStrict<Record<string, unknown>, GB>({
    id: pipe(mPipe(Obj.readKey("uid"), Str.read), throwOnNullish("uid")),
    data: pipe(
      mPipe(Obj.readKey("data"), Json.read, Obj.read as () => MValue<GBData>),
      throwOnNullish("data")
    ),
    dataVersion: pipe(Obj.readKey("dataVersion"), Num.read, onNullish(0)),
    // @ts-expect-error: type normal is not assign to popup
    meta: pipe(
      mPipe(Obj.readKey("meta"), Json.read, Obj.read as () => MValue<GBMeta>),
      throwOnNullish("meta")
    ),
    position: pipe(
      Obj.readKey("position"),
      Obj.read as () => MValue<GBPosition>,
      onNullish({} as GBPosition)
    ),
    status: pipe(
      Obj.readKey("status"),
      Union.readWithChoices(["draft", "publish"]),
      onNullish("draft") as () => GBStatus
    ),
    rules: pipe(
      // @ts-expect-error: Type 'unknown' is not assignable to type 'ApiAllRule'
      mPipe(Obj.readKey("rules"), Arr.readWithItemReader(apiRuleToEditorRule)),
      onNullish([] as GBRules)
    ),
    dependencies: pipe(
      mPipe(
        Obj.readKey("dependencies"),
        Arr.readWithItemReader<string>(Str.read)
      ),
      onNullish([] as GBDependencies)
    )
  });

  return reader(globalBlock);
};

export const stringifyGlobalBlock = (globalBlock: GB): APIGlobalBlock => {
  const data = JSON.stringify(globalBlock.data);
  const meta = JSON.stringify(globalBlock.meta);
  const rules = JSON.stringify(globalBlock.rules.map(editorRuleToApiRule));
  const position = JSON.stringify(globalBlock.position);
  const dependencies = JSON.stringify(globalBlock.dependencies);

  return {
    data,
    meta,
    rules,
    position,
    dependencies,
    title: globalBlock.title,
    tags: globalBlock.tags,
    uid: globalBlock.id,
    status: globalBlock.status,
    dataVersion: globalBlock.dataVersion
  };
};

//#endregion
