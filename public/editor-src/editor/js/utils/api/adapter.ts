import { match, parse } from "fp-utilities";
import Config, { isWp } from "visual/global/Config";
import { Block as APIGlobalBlock } from "visual/global/Config/types/configs/blocks/GlobalBlocks";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  GlobalBlock,
  Rule as GlobalBlockRule,
  SavedBlock,
  SavedLayout
} from "visual/types";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";
import { mPipe } from "visual/utils/fp/mPipe";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import {
  getUsedModelsFonts,
  getUsedModelsUpload,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { getUsedModelsImages } from "visual/utils/traverse/images";
import { onNullish } from "visual/utils/value";
import { BlogSourceItem } from "./types";

//#region Saved blocks | Saved layout

export interface Media {
  images: Array<string>;
  uploads: Array<string>;
  fonts: Array<string>;
}

export const makeBlockMeta = (
  block: SavedBlock | SavedLayout | GlobalBlock
): Media => {
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

//#endregion

//#region Page
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

//#region GlobalBlocks

export const stringifyGlobalBlock = (
  globalBlock: GlobalBlock
): APIGlobalBlock => {
  const rules = globalBlock.rules.map(editorRuleToApiRule);

  return { ...globalBlock, rules };
};

//#endregion
