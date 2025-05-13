import React from "react";
import Page from "visual/component/Editor";
import { ConfigProvider } from "visual/providers/ConfigProvider";
import { EditorModeProvider } from "visual/providers/EditorModeProvider";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { RenderProvider } from "visual/providers/RenderProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { InitStore } from "../components/InitStore";
import { RegisterParts } from "../components/RegisterParts";
import { Props } from "./types";

export const Editor = (props: Props): JSX.Element => {
  const { config, i18n, editorMode } = props;
  const addFile = config.api?.customFile?.addFile;

  return (
    <I18nextProvider i18n={i18n}>
      <RenderProvider renderType="editor">
        <ConfigProvider config={config}>
          <RegisterParts config={config}>
            <InitStore config={config} editorMode={editorMode}>
              <EditorModeProvider mode={editorMode}>
                <StyleProvider>
                  <Page addFile={addFile} editorMode={editorMode} />
                </StyleProvider>
              </EditorModeProvider>
            </InitStore>
          </RegisterParts>
        </ConfigProvider>
      </RenderProvider>
    </I18nextProvider>
  );
};
