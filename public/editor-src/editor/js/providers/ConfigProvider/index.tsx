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
import { UIEventType } from "visual/global/UIEventType";
import UIEvents from "visual/global/UIEvents";
import { ConfigContext } from "visual/providers/ConfigProvider/context";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { ReduxAction } from "visual/redux/actions2";
import { isInitializedSelector } from "visual/redux/selectors";
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

    const handleReady = (): void => {
      onLoad();
      UIEvents.emit(UIEventType.EditorReady);
    };

    if (isInitializedSelector(store.getState())) {
      handleReady();
      return;
    }

    const unsubscribe = store.subscribe(() => {
      if (isInitializedSelector(store.getState())) {
        storeSubscription.current?.();
        handleReady();
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
