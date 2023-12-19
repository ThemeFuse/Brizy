import { match, optional, parse } from "fp-utilities";
import Config, { isWp } from "visual/global/Config";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  GlobalBlock,
  Rule as GlobalBlockRule,
  PageCommon,
  SavedBlock,
  SavedLayout
} from "visual/types";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";
import { PageError } from "visual/utils/errors";
import { mPipe } from "visual/utils/fp/mPipe";
import { pipe } from "visual/utils/fp/pipe";
import * as Json from "visual/utils/reader/json";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import { readWithParser } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/reader/string";
import {
  getUsedModelsFonts,
  getUsedModelsUpload,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { getUsedModelsImages } from "visual/utils/traverse/images";
import { onNullish } from "visual/utils/value";
import { BlogSourceItem, CollectionSourceItem, Rule } from "./types";

export * from "./adapter-legacy";

//#region Saved blocks | Saved layout

export const makeBlockMeta = (
  block: SavedBlock | SavedLayout | GlobalBlock
): { images: Array<string>; uploads: Array<string>; fonts: Array<string> } => {
  const { data, meta } = block;
  const { extraFontStyles } = meta;
  const fonts = getUsedModelsFonts({ models: data });
  const images = getUsedModelsImages({ models: data });
  const fontsStyles = getUsedStylesFonts(extraFontStyles);
  const uploads = getUsedModelsUpload({ models: data });
  const fontsSet = new Set<string>();

  // Added only font upload
  [...fonts, ...fontsStyles].forEach(({ family, type }) => {
    type === "upload" && fontsSet.add(family);
  });

  return { images, uploads, fonts: [...fontsSet] };
};

//#region Page

export const parsePageCommon = (page: unknown): PageCommon => {
  const reader = mPipe(
    Obj.read,
    readWithParser<Record<string, unknown>, PageCommon>({
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => PageCommon["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as PageCommon["data"])
      ),
      dataVersion: pipe(Obj.readKey("dataVersion"), Num.read, onNullish(0)),
      title: pipe(Obj.readKey("title"), Str.read, onNullish("")),
      slug: pipe(Obj.readKey("slug"), Str.read, onNullish("")),
      status: (page) => {
        const status = mPipe(Obj.readKey("status"), Str.read)(page);

        switch (status) {
          case "draft":
            return "draft";
          case "publish":
          case "published":
            return "publish";
          default:
            // TODO: WP sends at export only id and data.
            // figure out what to do with all these defaults later
            return "draft"; // should be return undefined;
        }
      }
    })
  );
  const parsed = reader(page);

  if (parsed === undefined) {
    throw new PageError("Failed to parse page");
  }

  return parsed;
};

export const parseCollectionSourceItem = parse<
  Record<string, unknown>,
  CollectionSourceItem
>({
  id: mPipe(Obj.readKey("id"), Str.read),
  title: mPipe(Obj.readKey("title"), Str.read, onNullish("")),
  type: mPipe(Obj.readKey("type"), Str.read)
});

export const parsePageRules = parse<Record<string, unknown>, Rule>({
  id: pipe(mPipe(Obj.readKey("id"), Str.read), onNullish("")),
  blog_id: optional(mPipe(Obj.readKey("blog_id"), Str.read)),
  title: pipe(mPipe(Obj.readKey("title"), Str.read), onNullish("")),
  type: pipe(mPipe(Obj.readKey("type"), Str.read), onNullish(""))
});

export const parseBlogSourceItem = parse<
  Record<string, unknown>,
  BlogSourceItem
>({
  id: mPipe(Obj.readKey("id"), Str.read),
  title: mPipe(Obj.readKey("title"), Str.read, onNullish(""))
});

//#endregion

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

export const apiRuleToEditorRule: (v: ApiRule) => GlobalBlockRule = match(
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

export const editorRuleToApiRule: (v: GlobalBlockRule) => ApiRule = match(
  [
    isCollectionItemRule,
    (rule: CollectionItemRule): ApiCollectionItemRule => {
      const isWP = isWp(Config.getAll());
      return isWP
        ? {
            type: rule.type,
            appliedFor: rule.appliedFor,
            entityType: rule.entityType,
            entityValues: rule.entityValues
          }
        : {
            type: rule.type,
            mode: rule.mode,
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
