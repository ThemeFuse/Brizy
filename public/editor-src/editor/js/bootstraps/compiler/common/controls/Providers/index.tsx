import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { RegisterParts } from "visual/bootstraps/module/components/RegisterParts";
import { Config } from "visual/global/Config/InitConfig";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { RenderProvider } from "visual/providers/RenderProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { StyleSheetManager } from "visual/providers/StyleProvider/StyleSheetManager";
import { configIdSelector } from "visual/redux/selectors";
import { I18n } from "visual/utils/i18n";
import { Props } from "./types";

export function Providers(props: Props): JSX.Element {
  const { sheet, store, config, children } = props;
  const i18n = I18n.init({
    resources: {}
  });
  const reduxState = store.getState();
  const configId = configIdSelector(reduxState);
  const pageId = config.pageData?.id ?? "";

  return (
    <StyleSheetManager sheet={sheet}>
      <I18nextProvider i18n={i18n}>
        <Config id={configId} config={config}>
          <RegisterParts config={config}>
            <ReduxProvider store={store}>
              <RenderProvider renderType="view">
                <StyleProvider>
                  <EditorComponentProvider pageId={pageId}>
                    {children}
                  </EditorComponentProvider>
                </StyleProvider>
              </RenderProvider>
            </ReduxProvider>
          </RegisterParts>
        </Config>
      </I18nextProvider>
    </StyleSheetManager>
  );
}
