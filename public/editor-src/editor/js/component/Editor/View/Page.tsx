import React, { useCallback, useMemo } from "react";
import { useSelector, useStore } from "react-redux";
import { RootContainer } from "visual/component/RootContainer";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { useEditorMode } from "visual/providers/EditorModeProvider";
import { useTranslation } from "visual/providers/I18nProvider";
import { ReduxAction } from "visual/redux/actions2";
import { pageBlocksRawSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { getPageId } from "../utils";

export const Page = (): JSX.Element => {
  const { Page: BasePage } = EditorGlobal.getComponents();
  const pageBlocks = useSelector(pageBlocksRawSelector);
  const state = useSelector<ReduxState, ReduxState>((state) => state);
  const store = useStore<ReduxState, ReduxAction>();
  const config = useConfig();
  const { mode } = useEditorMode();
  // @ts-expect-error: ConfigCommon to Config
  const pageId = getPageId(config);
  const { t } = useTranslation();
  const dbValue = useMemo(() => ({ items: pageBlocks }), [pageBlocks]);

  const getGlobalConfig = useCallback(() => config, [config]);

  if (!BasePage) {
    return <div>{t("Missing Page Components")}</div>;
  }

  return (
    <RootContainer className="brz">
      <EditorComponentProvider pageId={pageId}>
        {/* @ts-expect-error: Missing EditorComponent props */}
        <BasePage
          dbValue={dbValue}
          reduxState={state}
          reduxStore={store}
          renderContext="view"
          editorMode={mode}
          getGlobalConfig={getGlobalConfig}
        />
      </EditorComponentProvider>
    </RootContainer>
  );
};
