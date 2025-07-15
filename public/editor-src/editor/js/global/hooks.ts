import { useConfig } from "visual/providers/ConfigProvider";
import { isPro, isRTL } from "visual/utils/env";

export const usePro = (): boolean => isPro(useConfig());

export const useIsRTL = (): boolean => isRTL(useConfig());
