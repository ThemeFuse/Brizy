import { getUsedModelsFonts, getUsedStylesFonts } from "visual/utils/traverse";
import { getUsedModelsImages } from "visual/utils/traverse/images";
import { SavedBlocksError, SavedLayoutError } from "visual/utils/errors";
import { GlobalBlock, SavedBlock, SavedLayout } from "visual/types";

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
