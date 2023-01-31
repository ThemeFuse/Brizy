import { match, parse } from "fp-utilities";
import Config, { isWp } from "visual/global/Config";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  ExternalPopupCloud,
  ExternalStoryCloud,
  GlobalBlock,
  Rule as GlobalBlockRule,
  InternalPopupCloud,
  Page,
  PageCommon,
  PageWP,
  SavedBlock,
  SavedLayout
} from "visual/types";
import {
  BlogSourceItem,
  CollectionSourceItem,
  Rule,
  SavedBlockMeta
} from "visual/utils/api/types";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks";
import {
  PageError,
  SavedBlocksError,
  SavedLayoutError
} from "visual/utils/errors";
import { mPipe } from "visual/utils/fp/mPipe";
import { pipe } from "visual/utils/fp/pipe";
import * as Json from "visual/utils/reader/json";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import { readWithParser } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/reader/string";
import * as Union from "visual/utils/reader/union";
import {
  getUsedModelsFonts,
  getUsedModelsUpload,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { getUsedModelsImages } from "visual/utils/traverse/images";
import { onNullish } from "visual/utils/value";

export * from "./adapter-legacy";

export interface SavedBlockFromApi {
  id: string;
  data?: string;
  dataVersion: number;
  meta?: string;
}
export interface SavedBlockMetaFromApi {
  id: string;
  uid: string;
  meta?: string;
  dataVersion: number;
  synchronizable: boolean;
  synchronized: boolean;
  isCloudEntity: boolean;
}

type SavedBlockToApi = Omit<SavedBlock, "data" | "meta"> & {
  uid: string;
  data: string;
  meta: string;
};

export type ParsedSavedBlockApi = Omit<SavedBlockFromApi, "data" | "meta"> & {
  data: SavedBlock["data"] & unknown;
  meta: SavedBlock["meta"] & unknown;
};

export type ParsedSavedLayoutApi = Omit<SavedBlockFromApi, "data" | "meta"> & {
  data: SavedLayout["data"] & unknown;
  meta: SavedLayout["meta"] & unknown;
};

export type ParsedSavedBlockApiMeta = Omit<SavedBlockMetaFromApi, "meta"> & {
  meta: SavedBlock["meta"];
};

// saved blocks | layout
export const parseSavedBlock = (
  savedBlock: SavedBlockFromApi
): ParsedSavedBlockApi => {
  let data;
  let meta;

  if (!savedBlock.data) {
    throw new SavedBlocksError("savedBlock data should exist");
  } else {
    try {
      data = JSON.parse(savedBlock.data);
    } catch (e) {
      throw new SavedBlocksError(
        `Failed to parse savedBlock data ${savedBlock.data}`
      );
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

export const parseSavedLayout = (
  savedLayout: SavedBlockFromApi
): ParsedSavedLayoutApi => {
  let data;
  let meta;

  if (!savedLayout.data) {
    throw new SavedLayoutError("savedLayout data should exist");
  } else {
    try {
      data = JSON.parse(savedLayout.data);
    } catch (e) {
      throw new SavedLayoutError(
        `Failed to parse savedLayout data ${savedLayout.data}`
      );
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

export const stringifySavedBlock = (
  savedBlock: (SavedBlock | SavedLayout) & { uid: string }
): SavedBlockToApi => {
  const data = JSON.stringify(savedBlock.data);
  const meta = JSON.stringify(savedBlock.meta);

  return { ...savedBlock, data, meta };
};

export const parseMetaSavedBlock = (
  savedBlock: SavedBlockMetaFromApi
): SavedBlockMeta => {
  let meta;

  if (!savedBlock.meta) {
    meta = {};
  } else {
    try {
      meta = JSON.parse(savedBlock.meta);
    } catch (e) {
      meta = {};
    }
  }

  return { ...savedBlock, meta };
};

export const makeBlockMeta = (
  block: SavedBlock | SavedLayout | GlobalBlock
): string => {
  const { data, meta } = block;
  const { extraFontStyles } = meta;
  const fonts = getUsedModelsFonts({ models: data });
  const images = getUsedModelsImages({ models: data });
  const fontsStyles = getUsedStylesFonts(extraFontStyles);
  const uploads = getUsedModelsUpload({ models: data });
  const fontsSet = new Set();

  // Added only font upload
  [...fonts, ...fontsStyles].forEach(({ family, type }) => {
    type === "upload" && fontsSet.add(family);
  });

  return JSON.stringify({
    images,
    uploads,
    fonts: [...fontsSet]
  });
};

//#region Page

type PageSerialized<T extends PageWP | InternalPopupCloud> = Omit<T, "data"> & {
  data: string;
};

export const parseInternalPopup = (page: unknown): InternalPopupCloud => {
  const reader = mPipe(
    Obj.read,
    readWithParser<Record<string, unknown>, InternalPopupCloud>({
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => InternalPopupCloud["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as InternalPopupCloud["data"])
      ),
      rules: pipe(
        Obj.readKey("rules"),
        Json.read,
        Obj.read as () => InternalPopupCloud["rules"] | undefined, // TODO: needs more thorough checking
        onNullish([] as InternalPopupCloud["rules"])
      ),
      dataVersion: mPipe(Obj.readKey("dataVersion"), Num.read),
      title: pipe(Obj.readKey("title"), Str.read, onNullish("")),
      status: mPipe(
        Obj.readKey("status"),
        Union.readWithChoices(["draft", "publish"])
      ),
      project: mPipe(Obj.readKey("project"), Num.read)
    })
  );
  const parsed = reader(page);

  if (parsed === undefined) {
    throw new PageError("Failed to parse page");
  }

  return parsed;
};

export const parseExternalPopup = (popup: unknown): ExternalPopupCloud => {
  const reader = mPipe(
    Obj.read,
    readWithParser<Record<string, unknown>, ExternalPopupCloud>({
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => ExternalPopupCloud["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as ExternalPopupCloud["data"])
      ),
      dataVersion: mPipe(Obj.readKey("dataVersion"), Num.read),
      status: mPipe(
        Obj.readKey("status"),
        Union.readWithChoices(["draft", "publish"])
      )
    })
  );
  const parsed = reader(popup);

  if (parsed === undefined) {
    throw new PageError("Failed to parse popup");
  }

  return parsed;
};

export const parseExternalStory = (story: unknown): ExternalStoryCloud => {
  const reader = mPipe(
    Obj.read,
    readWithParser<Record<string, unknown>, ExternalStoryCloud>({
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => ExternalStoryCloud["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as ExternalStoryCloud["data"])
      ),
      slug: pipe(Obj.readKey("slug"), Str.read, onNullish("")),
      dataVersion: mPipe(Obj.readKey("dataVersion"), Num.read),
      status: mPipe(
        Obj.readKey("status"),
        Union.readWithChoices(["draft", "publish"])
      )
    })
  );
  const parsed = reader(story);

  if (parsed === undefined) {
    throw new PageError("Failed to parse story");
  }

  return parsed;
};

export const parsePageWP = (page: unknown): PageWP => {
  const reader = mPipe(
    Obj.read,
    readWithParser<Record<string, unknown>, PageWP>({
      _kind: () => "wp",
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => PageWP["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as PageWP["data"])
      ),
      dataVersion: pipe(Obj.readKey("dataVersion"), Num.read, onNullish(0)),
      slug: pipe(Obj.readKey("slug"), Str.read, onNullish("")),
      title: pipe(Obj.readKey("title"), Str.read, onNullish("")),
      status: pipe(
        Obj.readKey("status"),
        Union.readWithChoices(["draft", "publish"]),
        onNullish("draft") as () => PageWP["status"]
      ),
      is_index: pipe(
        Obj.readKey("is_index"),
        Union.readWithChoices([true, false]),
        onNullish(false)
      ),
      template: pipe(Obj.readKey("template"), Str.read, onNullish("")),
      url: pipe(Obj.readKey("url"), Str.read, onNullish(""))
    })
  );
  const parsed = reader(page);

  if (parsed === undefined) {
    throw new PageError("Failed to parse page");
  }

  return parsed;
};

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

export const pageDataToString = (pageData: Page["data"]): string =>
  JSON.stringify(pageData);

export function stringifyPage(
  page: InternalPopupCloud
): PageSerialized<InternalPopupCloud>;
export function stringifyPage(page: PageWP): PageSerialized<PageWP>;
export function stringifyPage(
  page: PageWP | InternalPopupCloud
): PageSerialized<PageWP | InternalPopupCloud> {
  return { ...page, data: JSON.stringify(page.data) };
}

export const parseCollectionSourceItem = parse<
  Record<string, unknown>,
  CollectionSourceItem
>({
  id: mPipe(Obj.readKey("id"), Str.read),
  title: mPipe(Obj.readKey("title"), Str.read, onNullish("")),
  type: mPipe(Obj.readKey("type"), Str.read)
});

export const parsePageRules = parse<Record<string, unknown>, Rule>({
  id: mPipe(Obj.readKey("id"), Str.read),
  title: mPipe(Obj.readKey("title"), Str.read, onNullish("")),
  type: mPipe(Obj.readKey("type"), Str.read)
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
