import { match } from "fp-utilities";
import { isWp } from "visual/global/Config/types/configs/WP";
import { objectToQueryString, urlContainsQueryString } from "visual/utils/url";
import { BlockTypes } from "../types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const isBlock = (type: BlockTypes): type is "BLOCK" => type === "BLOCK";
export const isPopup = (type: BlockTypes): type is "POPUP" => type === "POPUP";
export const isLayout = (type: BlockTypes): type is "LAYOUT" =>
  type === "LAYOUT";

export const createBlockId = (id: string, isPro: boolean): string => {
  return isPro ? `${id}:1` : `${id}:0`;
};

export const getExportBlocksUrls = (
  type: BlockTypes,
  id: string,
  isPro: boolean,
  config: ConfigCommon
): string => {
  const { editorVersion } = config;

  if (isWp(config)) {
    const { url, hash, downloadBlocks, downloadLayouts } = config.wp.api;
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

    return urlContainsQueryString(url)
      ? `${url}&${params}`
      : `${url}?${params}`;
  }

  const url = `${config?.urls?.api}/zip_template/export`;
  const params = objectToQueryString({
    id,
    version: editorVersion,
    type: type.toLowerCase(),
    pro: isPro ? "1" : "0",
    ...(TARGET === "Cloud-localhost"
      ? { "X-AUTH-USER-TOKEN": config.tokenV1 ?? "" }
      : {})
  });

  return urlContainsQueryString(url) ? `${url}&${params}` : `${url}?${params}`;
};
