import { useConfig } from "visual/providers/ConfigProvider";
import { isPro } from "visual/utils/env";

export const usePro = (): boolean => isPro(useConfig());
