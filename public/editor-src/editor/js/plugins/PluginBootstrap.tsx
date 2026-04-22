/**
 * Initializes the plugin system during editor startup.
 * Creates the EditorAPI, registers all config.plugins, and provides context.
 */
import React, { type ReactNode, useEffect, useMemo } from "react";
import { useDispatch, useStore } from "react-redux";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { useTranslation } from "visual/providers/I18nProvider";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import { createEditorAPI } from "./EditorAPI";
import { PluginProvider } from "./PluginProvider";
import { PluginRegistry } from "./PluginRegistry";

interface Props {
  config: ConfigCommon;
  children: ReactNode;
}

export const PluginBootstrap = ({ config, children }: Props): JSX.Element => {
  const store = useStore<ReduxState>();
  const dispatch = useDispatch<TypedDispatch>();
  const { t } = useTranslation();

  const registry = useMemo(() => {
    const parts = createEditorAPI({
      getState: store.getState,
      dispatch,
      config,
      t
    });
    const reg = new PluginRegistry(parts);
    reg.registerAll(config.plugins ?? []);
    return reg;
  }, [store, dispatch, config, t]);

  useEffect(() => {
    return () => {
      registry.destroy();
    };
  }, [registry]);

  return <PluginProvider registry={registry}>{children}</PluginProvider>;
};
