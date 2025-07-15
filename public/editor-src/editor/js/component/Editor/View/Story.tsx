import React, { useCallback } from "react";
import { useSelector, useStore } from "react-redux";
import { RootContainer } from "visual/component/RootContainer";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { useEditorMode } from "visual/providers/EditorModeProvider";
import { useTranslation } from "visual/providers/I18nProvider";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { getPageId } from "../utils";

export const Story = (): JSX.Element => {
  const { PageStory } = EditorGlobal.getComponents();
  const dbValue = useSelector(pageDataDraftBlocksSelector);
  const state = useSelector<ReduxState, ReduxState>((state) => state);
  const store = useStore();
  const config = useConfig();
  const { mode } = useEditorMode();
  const { t } = useTranslation();
  // @ts-expect-error: ConfigCommon to Config
  const pageId = getPageId(config);

  const getGlobalConfig = useCallback(() => config, [config]);

  if (!PageStory) {
    return <div>{t("Missing PageStory Components")}</div>;
  }

  return (
    <RootContainer className="brz">
      <EditorComponentProvider pageId={pageId}>
        {/* @ts-expect-error: Missing EditorComponent props */}
        <PageStory
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
