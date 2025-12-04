import { isEqual, isFunction } from "es-toolkit";
import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import { useStore } from "react-redux";
import { Unsubscribe } from "redux";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ConfigContext } from "visual/providers/ConfigProvider/context";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";

export const ConfigProvider: FC<
  PropsWithChildren<{ config: ConfigCommon }>
> = ({ config, children }) => {
  const lastValue = useRef<{ getConfig: GetConfig }>({
    getConfig: () => config
  });

  const storeSubscription = useRef<Unsubscribe | null>(null);
  const store = useStore<ReduxState, ReduxAction>();
  const onLoad = config.onLoad;

  useEffect(() => {
    if (!isFunction(onLoad)) {
      return;
    }

    if (store.getState().blocksHtml.initialized) {
      onLoad();
      return;
    }

    const unsubscribe = store.subscribe(() => {
      if (store.getState().blocksHtml.initialized) {
        storeSubscription.current?.();
        onLoad();
      }
    });

    storeSubscription.current = unsubscribe;

    return unsubscribe;
  }, [store, onLoad]);

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
