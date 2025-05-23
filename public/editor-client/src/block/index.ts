import { objectToQueryString, urlContainsQueryString } from "@/api/utils";
import { createBlockId } from "@/block/utils";
import { getConfig } from "@/config";
import { t } from "@/utils/i18n";
import { match } from "fp-utilities";
import { BlockTypes } from "./types";

export const isBlock = (type: BlockTypes): type is "BLOCK" => type === "BLOCK";
export const isPopup = (type: BlockTypes): type is "POPUP" => type === "POPUP";
export const isLayout = (type: BlockTypes): type is "LAYOUT" =>
  type === "LAYOUT";

export const getExportBlockUrl = ({
  id,
  isPro,
  type
}: {
  id: string;
  isPro: boolean;
  type: BlockTypes;
}): string => {
  const config = getConfig();
  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { actions, hash, url, editorVersion } = config;

  const { downloadBlocks, downloadLayouts } = actions;

  const getAction = match(
    [isBlock, (): string => downloadBlocks],
    [isLayout, (): string => downloadLayouts],
    [isPopup, (): string => downloadBlocks]
  );
  const params = objectToQueryString({
    hash,
    uid: createBlockId(id, isPro),
    version: editorVersion,
    action: getAction(type),
    type: type.toLowerCase()
  });

  return urlContainsQueryString(url) ? `${url}&${params}` : `${url}?${params}`;
};
