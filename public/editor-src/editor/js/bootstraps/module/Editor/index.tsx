import { AlphaConfigProvider } from "@brizy/ui/lib/AlphaConfigProvider";
import { AlphaStyleProvider } from "@brizy/ui/lib/AlphaStyleProvider";
import { ConfigProvider as UIConfigProvider } from "@brizy/ui/lib/ConfigProvider";
import React from "react";
import Page from "visual/component/Editor";
import { PluginBootstrap } from "visual/plugins/PluginBootstrap";
import { ConfigProvider } from "visual/providers/ConfigProvider";
import { EditorModeProvider } from "visual/providers/EditorModeProvider";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { RenderProvider } from "visual/providers/RenderProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { InitStore } from "../components/InitStore";
import { RegisterParts } from "../components/RegisterParts";
import type { Props } from "./types";

export const Editor = (props: Props): JSX.Element => {
  const { config, i18n, editorMode } = props;
  const addFile = config.api?.customFile?.addFile;

  return (
    <I18nextProvider i18n={i18n}>
      <RenderProvider renderType="editor">
        <InitStore config={config} editorMode={editorMode}>
          <ConfigProvider config={config}>
            <RegisterParts config={config}>
              <PluginBootstrap config={config}>
                <EditorModeProvider mode={editorMode}>
                  <StyleProvider>
                    <AlphaStyleProvider container={window.parent.document.head}>
                      <AlphaConfigProvider>
                        <UIConfigProvider>
                          <Page addFile={addFile} editorMode={editorMode} />
                        </UIConfigProvider>
                      </AlphaConfigProvider>
                    </AlphaStyleProvider>
                  </StyleProvider>
                </EditorModeProvider>
              </PluginBootstrap>
            </RegisterParts>
          </ConfigProvider>
        </InitStore>
      </RenderProvider>
    </I18nextProvider>
  );
};
