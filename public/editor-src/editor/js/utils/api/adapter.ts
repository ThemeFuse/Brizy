/* eslint-disable @typescript-eslint/camelcase */
import { readWithParser } from "visual/utils/reader/readWithParser";

export * from "./adapter-legacy";

import { getUsedModelsFonts, getUsedStylesFonts } from "visual/utils/traverse";
import { getUsedModelsImages } from "visual/utils/traverse/images";
import { SavedBlocksError, SavedLayoutError } from "visual/utils/errors";
import {
  PageCommon,
  PageCloud,
  InternalPopupCloud,
  ExternalPopupCloud,
  ExternalStoryCloud,
  PageWP,
  Page,
  GlobalBlock,
  SavedBlock,
  SavedLayout
} from "visual/types";
import { PageError } from "visual/utils/errors";
import { pipe } from "visual/utils/fp/pipe";
import { mPipe } from "visual/utils/fp/mPipe";
import * as Str from "visual/utils/reader/string";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Union from "visual/utils/reader/union";
import * as Json from "visual/utils/reader/json";
import { onNullish } from "visual/utils/value";

type SavedBlockFromApi = {
  id: string;
  data?: string;
  dataVersion: number;
  meta?: string;
};
type SavedBlockMetaFromApi = {
  id: string;
  meta?: string;
};

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
  meta: object;
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
): ParsedSavedBlockApiMeta => {
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
  const fontsSet = new Set();

  // Added only font upload
  [...fonts, ...fontsStyles].forEach(({ family, type }) => {
    type === "upload" && fontsSet.add(family);
  });

  return JSON.stringify({
    images,
    fonts: [...fontsSet]
  });
};

//#region Page

type PageSerialized<T extends PageCloud | PageWP | InternalPopupCloud> = Omit<
  T,
  "data"
> & {
  data: string;
};

export const parsePage = (page: unknown): PageCloud => {
  const reader = mPipe(
    Obj.read,
    readWithParser<object, PageCloud>({
      _kind: () => "cloud",
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => PageCloud["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as PageCloud["data"])
      ),
      dataVersion: mPipe(Obj.readKey("dataVersion"), Num.read),
      type: mPipe(Obj.readKey("type"), Str.read),
      slug: mPipe(Obj.readKey("slug"), Str.read),
      title: pipe(Obj.readKey("title"), Str.read, onNullish("")),
      description: pipe(Obj.readKey("description"), Str.read, onNullish("")),
      status: mPipe(
        Obj.readKey("status"),
        Union.readWithChoices(["draft", "publish"])
      ),
      project: mPipe(Obj.readKey("project"), Num.read),
      is_index: mPipe(Obj.readKey("is_index"), Union.readWithChoices([0, 1]))
    })
  );
  const parsed = reader(page);

  if (parsed === undefined) {
    throw new PageError("Failed to parse page");
  }

  return parsed;
};

export const parseInternalPopup = (page: unknown): InternalPopupCloud => {
  const reader = mPipe(
    Obj.read,
    readWithParser<object, InternalPopupCloud>({
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
    readWithParser<object, ExternalPopupCloud>({
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
    readWithParser<object, ExternalStoryCloud>({
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
    readWithParser<object, PageWP>({
      _kind: () => "wp",
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => PageCloud["data"] | undefined, // TODO: needs more thorough checking
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
    readWithParser<object, PageCommon>({
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => PageCloud["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as PageCloud["data"])
      ),
      dataVersion: pipe(Obj.readKey("dataVersion"), Num.read, onNullish(0)),
      title: pipe(Obj.readKey("title"), Str.read, onNullish("")),
      slug: pipe(Obj.readKey("slug"), Str.read, onNullish("")),
      status: page => {
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

export function stringifyPage(page: PageCloud): PageSerialized<PageCloud>;
export function stringifyPage(
  page: InternalPopupCloud
): PageSerialized<InternalPopupCloud>;
export function stringifyPage(page: PageWP): PageSerialized<PageWP>;
export function stringifyPage(
  page: PageCloud | PageWP | InternalPopupCloud
): PageSerialized<PageCloud | PageWP | InternalPopupCloud> {
  return { ...page, data: JSON.stringify(page.data) };
}

//#endregion
