import { match } from "fp-utilities";
import Config from "visual/global/Config";
import { urlContainsQueryString, objectToQueryString } from "visual/utils/url";
import { isWp } from "visual/global/Config/types/configs/WP";
import { t } from "visual/utils/i18n";
import { BlockTypes } from "../types";

export const isBlock = (type: BlockTypes): type is "BLOCK" => type === "BLOCK";
export const isPopup = (type: BlockTypes): type is "POPUP" => type === "POPUP";
export const isLayout = (type: BlockTypes): type is "LAYOUT" =>
  type === "LAYOUT";

export const getExportBlocksUrls = (
  type: BlockTypes,
  ids: string[]
): string => {
  const config = Config.getAll();
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
      uid: ids,
      version: editorVersion,
      action: getAction(type),
      type: type.toLowerCase()
    });

    return urlContainsQueryString(url)
      ? `${url}&${params}`
      : `${url}?${params}`;
  }

  const url = config.urls.api;
  const getAction = match(
    [isBlock, (): string => "downloadBlocks"],
    [isLayout, (): string => "downloadLayouts"],
    [isPopup, (): string => "downloadPopups"]
  );

  const params = objectToQueryString({
    uid: ids,
    version: editorVersion,
    action: getAction(type),
    type: type.toLowerCase()
  });

  return urlContainsQueryString(url) ? `${url}&${params}` : `${url}?${params}`;
};

export const createBlockId = (id: string, isPro: boolean): string => {
  return isPro ? `${id}:1` : `${id}:0`;
};

interface WPErrResponse {
  success: false;
  data: string;
}

interface CloudErrResponse {
  code: number;
  message: string;
}

type ResponseError = WPErrResponse | CloudErrResponse;

const isWPError = (e: ResponseError): e is WPErrResponse => "data" in e;

const isCloudError = (e: ResponseError): e is CloudErrResponse =>
  "message" in e;

export const getError = (e: ResponseError): string => {
  if (typeof e !== "object") {
    return t("Something went wrong");
  }

  if (isWPError(e)) {
    return e.data;
  }

  if (isCloudError(e)) {
    return e.message;
  }

  return t("Something went wrong");
};
