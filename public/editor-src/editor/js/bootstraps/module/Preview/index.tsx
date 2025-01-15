import { fromJS } from "immutable";
import React, { MutableRefObject, useMemo, useRef } from "react";
import Page from "visual/component/Editor/View";
import { Config } from "visual/global/Config/InitConfig";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorModeContext } from "visual/global/EditorModeContext";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { RenderProvider } from "visual/providers/RenderProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { uuid } from "visual/utils/uuid";
import { InitStore } from "../components/InitStore";
import { RegisterParts } from "../components/RegisterParts";
import { Props } from "./types";

export const Preview = (props: Props): JSX.Element => {
  const { config, editorMode } = props;

  const lastConfig: MutableRefObject<ConfigCommon> = useRef(config);
  const lastUid = useRef(uuid());

  const configId = useMemo(() => {
    const _lastConfig = fromJS(lastConfig.current);
    const currentConfig = fromJS(config);

    if (!_lastConfig?.equals(currentConfig)) {
      lastConfig.current = config;
      lastUid.current = uuid();
    }

    return lastUid.current;
  }, [config]);

  return (
    <I18nextProvider>
      <RenderProvider renderType="view">
        <Config id={configId} config={config}>
          <RegisterParts config={config}>
            <InitStore renderType="view" configId={configId} config={config}>
              <StyleProvider>
                <EditorModeContext.Provider value={editorMode}>
                  <Page editorMode={editorMode} />
                </EditorModeContext.Provider>
              </StyleProvider>
            </InitStore>
          </RegisterParts>
        </Config>
      </RenderProvider>
    </I18nextProvider>
  );
};
