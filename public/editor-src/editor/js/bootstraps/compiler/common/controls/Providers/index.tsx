import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { RegisterParts } from "visual/bootstraps/module/components/RegisterParts";
import { ConfigProvider } from "visual/providers/ConfigProvider";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { EditorModeProvider } from "visual/providers/EditorModeProvider";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { RenderProvider } from "visual/providers/RenderProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { StyleSheetManager } from "visual/providers/StyleProvider/StyleSheetManager";
import { I18n } from "visual/utils/i18n";
import { Props } from "./types";

export function Providers(props: Props): JSX.Element {
  const { sheet, store, config, children, editorMode } = props;
  const i18n = I18n.init({
    resources: {}
  });
  const pageId = config.pageData?.id ?? "";

  return (
    <StyleSheetManager sheet={sheet}>
      <I18nextProvider i18n={i18n}>
        <ReduxProvider store={store}>
          <ConfigProvider config={config}>
            <RegisterParts config={config}>
              <RenderProvider renderType="view">
                <EditorModeProvider mode={editorMode}>
                  <StyleProvider>
                    <EditorComponentProvider pageId={pageId}>
                      {children}
                    </EditorComponentProvider>
                  </StyleProvider>
                </EditorModeProvider>
              </RenderProvider>
            </RegisterParts>
          </ConfigProvider>
        </ReduxProvider>
      </I18nextProvider>
    </StyleSheetManager>
  );
}
