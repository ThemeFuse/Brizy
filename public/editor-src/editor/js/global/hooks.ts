import { useSelector } from "react-redux";
import { configSelector } from "visual/redux/selectors";
import { isPro } from "visual/utils/env";
import { ConfigCommon } from "./Config/types/configs/ConfigCommon";

export function useConfig(): ConfigCommon {
  return useSelector(configSelector);
}

export const usePro = (): boolean => isPro(useConfig());
