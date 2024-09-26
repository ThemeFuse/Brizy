import { Config } from "@/config";
import { GlobalBlock } from "@/types/GlobalBlocks";
import { Page } from "@/types/Page";
import { Project } from "@/types/Project";
import {
  CreatedSavedBlock,
  CreatedSavedLayout,
  CreateSavedBlock,
  CreateSavedLayout,
  SavedBlock,
  SavedBlockMeta,
  SavedLayout
} from "@/types/SavedBlocks";
import { t } from "@/utils/i18n";
import { isNullish } from "@/utils/isNullish";
import { encode } from "js-base64";

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
  globalStyles?: string;
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
  const globalStyles = JSON.stringify(block.block.globalStyles);

  return { ...block.block, data, meta, media, globalStyles };
};

export const parseMetaSavedBlock = (
  savedBlock: SavedBlockMetaFromApi
): SavedBlockMeta => {
  let meta;
  const title = savedBlock.title ?? "";
  let tags = savedBlock.tags ?? "";
  let globalStyles: string;

  if (!savedBlock.meta) {
    meta = {};
  } else {
    try {
      meta = JSON.parse(savedBlock.meta);
    } catch (e) {
      meta = {};
    }
  }

  if (!savedBlock.globalStyles) {
    globalStyles = "";
  } else {
    try {
      globalStyles = JSON.parse(savedBlock.globalStyles);
    } catch (e) {
      globalStyles = "";
    }
  }

  if (tags === ",") {
    tags = "";
  }

  return { ...savedBlock, meta, title, tags, globalStyles };
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

type APIProject = Omit<Project, "data" | "dataVersion" | "compiled"> & {
  data: string;
  dataVersion: string;
  compiled?: string;
};

export const stringifyProject = (project: Project): APIProject => {
  const { data, dataVersion, compiled, ..._project } = project;

  return {
    ..._project,
    data: JSON.stringify(data),
    dataVersion: `${dataVersion}`,
    ...(compiled && { compiled: JSON.stringify(compiled) })
  };
};

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

type APIPage = Omit<
  Page,
  "data" | "dataVersion" | "compiled" | "dependencies"
> & {
  data: string;
  dataVersion: string;
  compiled?: string;
  dependencies?: string;
};

export const stringifyPage = (page: Page): APIPage => {
  const { data, dataVersion, compiled: _compiled, ..._page } = page;
  const compiled = _compiled
    ? JSON.stringify({ ..._compiled, html: encode(_compiled.html) })
    : undefined;
  const dependencies = page.dependencies
    ? JSON.stringify(page.dependencies)
    : undefined;

  return {
    ..._page,
    data: JSON.stringify(data),
    dataVersion: `${dataVersion}`,
    compiled,
    dependencies
  };
};

//#endregion

//#region Global Blocks

interface APIGlobalBlock {
  uid: string;
  data: string;
  status: string;
  rules: string;
  position: string | null;
  meta: string;
  title?: string;
  tags?: string;
  compiled?: string;
  dependencies?: string;
}

export const stringifyGlobalBlock = (
  globalBlock: GlobalBlock
): APIGlobalBlock => {
  const data = JSON.stringify(globalBlock.data);
  const meta = JSON.stringify(globalBlock.meta);
  const rules = JSON.stringify(globalBlock.rules);
  const position = isNullish(globalBlock.position)
    ? null
    : JSON.stringify(globalBlock.position);
  const compiled = globalBlock.compiled
    ? JSON.stringify({
        ...globalBlock.compiled,
        html: encode(globalBlock.compiled.html)
      })
    : undefined;
  const dependencies = globalBlock.dependencies
    ? JSON.stringify(globalBlock.dependencies)
    : undefined;

  return {
    data,
    meta,
    rules,
    position,
    compiled,
    dependencies,
    title: globalBlock.title,
    tags: globalBlock.tags,
    uid: globalBlock.uid,
    status: globalBlock.status
  };
};

//#endregion
