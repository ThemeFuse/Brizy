import { isEqual, isFunction } from "es-toolkit";
import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ConfigContext } from "visual/providers/ConfigProvider/context";
import { GetConfig } from "visual/providers/ConfigProvider/types";

export const ConfigProvider: FC<
  PropsWithChildren<{ config: ConfigCommon }>
> = ({ config, children }) => {
  const lastValue = useRef<{ getConfig: GetConfig }>({
    getConfig: () => config
  });

  useEffect(() => {
    if (isFunction(config.onLoad)) {
      config.onLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => {
    if (!isEqual(lastValue.current.getConfig(), config)) {
      lastValue.current = { getConfig: () => config };
    }

    return lastValue.current;
  }, [config]);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export function useConfig(): ConfigCommon {
  const config = useContext(ConfigContext)?.getConfig();

  if (!config) {
    throw new Error("Missing configuration");
  }

  return config;
}
