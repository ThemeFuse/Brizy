import { isEqual } from "es-toolkit";
import React, { MutableRefObject, useMemo, useRef } from "react";
import Page from "visual/component/Editor";
import { Config } from "visual/global/Config/InitConfig";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorModeProvider } from "visual/providers/EditorModeProvider";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { RenderProvider } from "visual/providers/RenderProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { uuid } from "visual/utils/uuid";
import { InitStore } from "../components/InitStore";
import { RegisterParts } from "../components/RegisterParts";
import { Props } from "./types";

export const Editor = (props: Props): JSX.Element => {
  const { config, i18n, editorMode } = props;
  const addFile = config.api?.customFile?.addFile;
  const lastConfig: MutableRefObject<ConfigCommon> = useRef(config);
  const lastUid = useRef(uuid());

  const configId = useMemo(() => {
    if (!isEqual(lastConfig.current, config)) {
      lastConfig.current = config;
      lastUid.current = uuid();
    }

    return lastUid.current;
  }, [config]);

  return (
    <I18nextProvider i18n={i18n}>
      <RenderProvider renderType="editor">
        <Config id={configId} config={config}>
          <RegisterParts config={config}>
            <InitStore
              configId={configId}
              config={config}
              editorMode={editorMode}
            >
              <EditorModeProvider mode={editorMode}>
                <StyleProvider>
                  <Page addFile={addFile} editorMode={editorMode} />
                </StyleProvider>
              </EditorModeProvider>
            </InitStore>
          </RegisterParts>
        </Config>
      </RenderProvider>
    </I18nextProvider>
  );
};
