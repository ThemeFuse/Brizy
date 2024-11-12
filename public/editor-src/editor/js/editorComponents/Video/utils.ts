import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { checkValue2 } from "visual/utils/checkValue";
import { capitalize } from "visual/utils/string";
import type { Literal } from "visual/utils/types/Literal";
import { ChoiceTypes, Ratio, VideoTypes } from "./types";

export const containsShorts = (s: string): boolean => s.includes("/shorts/");

const getTypes = (type: VideoTypes): ChoiceTypes => {
  const title = (
    type === "url" ? type.toUpperCase() : capitalize(type)
  ) as VideoTypes;

  return { title, value: type };
};

export const typesChoice = (config: ConfigCommon) => {
  const configTypes = config.elements?.video?.types;

  return configTypes?.map(getTypes);
};

export const isRatio = (v: Literal): v is Ratio =>
  !!checkValue2<Ratio>(Ratio)(v);

export const getRatio = (ratio: Ratio): string => ratio.replace(":", "/");
