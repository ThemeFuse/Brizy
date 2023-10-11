import _ from "underscore";
import { SizeType } from "visual/global/Config/types/configs/common";
import { objectToQueryString } from "visual/utils/url";
import { CustomSize, Data, FilterOption } from "./types";

export const getFilter = (options: FilterOption): string => {
  const roundedOptions = _.mapObject(options, (val) =>
    typeof val === "number" ? Math.round(val) : val
  );

  return objectToQueryString(roundedOptions);
};

export const isCropSize = (d: Data): d is CustomSize =>
  d.sizeType === SizeType.custom;

export const isSVGExtension = (extension: string): extension is "svg" =>
  extension === "svg";

export const isGIFExtension = (extension: string): extension is "gif" =>
  extension === "gif";
