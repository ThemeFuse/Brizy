import { isEqual } from "es-toolkit";
import React, { MutableRefObject, useMemo, useRef } from "react";
import Page from "visual/component/Editor/View";
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
import { getMode } from "./utils/getMode";

export const Preview = (props: Props): JSX.Element => {
  const {
    config: partialConfig,
    pageData,
    projectData,
    mode: _mode,
    thirdPartyComponents
  } = props;
  const project = useMemo(
    () =>
      "id" in projectData
        ? projectData
        : { id: "1", dataVersion: 1, data: projectData },
    [projectData]
  );
  const mode = getMode(_mode);
  const config: ConfigCommon = useMemo(() => {
    return {
      ...partialConfig,
      thirdPartyComponents,
      mode,
      pageData,
      projectData: project
    };
  }, [partialConfig, mode, pageData, project, thirdPartyComponents]);

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
    <I18nextProvider>
      <RenderProvider renderType="view">
        <Config id={configId} config={config}>
          <RegisterParts config={config}>
            <InitStore configId={configId} config={config} editorMode={mode}>
              <EditorModeProvider mode={mode}>
                <StyleProvider>
                  <Page editorMode={mode} />
                </StyleProvider>
              </EditorModeProvider>
            </InitStore>
          </RegisterParts>
        </Config>
      </RenderProvider>
    </I18nextProvider>
  );
};
