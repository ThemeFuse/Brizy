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
  const tags = savedBlock.tags ?? "";

  if (!savedBlock.meta) {
    meta = {};
  } else {
    try {
      meta = JSON.parse(savedBlock.meta);
    } catch (e) {
      meta = {};
    }
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
