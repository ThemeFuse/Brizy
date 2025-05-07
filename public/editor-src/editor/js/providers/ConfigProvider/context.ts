import { createContext } from "react";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { MValue } from "visual/utils/value";

interface ConfigProvider {
  getConfig: GetConfig;
}

export const ConfigContext = createContext<MValue<ConfigProvider>>(undefined);
