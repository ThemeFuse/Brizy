import { createContext } from "react";
import type { GetConfig } from "visual/providers/ConfigProvider/types";
import type { MValue } from "visual/utils/value";

export interface ConfigProvider {
  getConfig: GetConfig;
}

export const ConfigContext = createContext<MValue<ConfigProvider>>(undefined);
