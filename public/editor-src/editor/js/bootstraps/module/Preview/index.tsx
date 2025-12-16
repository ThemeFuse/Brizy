import { noop } from "es-toolkit";
import React, { useMemo } from "react";
import Page from "visual/component/Editor/View";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ConfigProvider } from "visual/providers/ConfigProvider";
import { EditorModeProvider } from "visual/providers/EditorModeProvider";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { RenderProvider } from "visual/providers/RenderProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { setIds } from "visual/utils/models";
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

  const page = useMemo(() => {
    const pageDataItems = setIds(pageData?.data?.items || [], {
      keepExistingIds: true
    });

    return {
      ...(pageData || {}),
      data: {
        ...(pageData?.data || {}),
        items: pageDataItems
      }
    };
  }, [pageData]);

  const config: ConfigCommon = useMemo(() => {
    const _project = partialConfig?.project ?? {
      id: project.id
    };
    const container = partialConfig?.container ?? {
      id: 1
    };
    const editorVersion = partialConfig?.editorVersion ?? "1";
    const onUpdate = partialConfig?.onUpdate ?? noop;
    const onCompile = partialConfig?.onCompile ?? noop;

    return {
      ...partialConfig,
      project: _project,
      container,
      editorVersion,
      thirdPartyComponents,
      onUpdate,
      onCompile,
      mode,
      pageData: page,
      projectData: project
    };
  }, [partialConfig, mode, page, project, thirdPartyComponents]);

  return (
    <I18nextProvider>
      <RenderProvider renderType="view">
        <InitStore config={config} editorMode={mode}>
          <ConfigProvider config={config}>
            <RegisterParts config={config}>
              <EditorModeProvider mode={mode}>
                <StyleProvider>
                  <Page editorMode={mode} />
                </StyleProvider>
              </EditorModeProvider>
            </RegisterParts>
          </ConfigProvider>
        </InitStore>
      </RenderProvider>
    </I18nextProvider>
  );
};
