import React, { useMemo } from "react";
import { useSelector, useStore } from "react-redux";
import { RootContainer } from "visual/component/RootContainer";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/global/hooks";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { useEditorMode } from "visual/providers/EditorModeProvider";
import { pageBlocksRawSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import { getPageId } from "../utils";

export const Page = (): JSX.Element => {
  const { Page: BasePage } = EditorGlobal.getComponents();
  const pageBlocks = useSelector(pageBlocksRawSelector);
  const state = useSelector<ReduxState, ReduxState>((state) => state);
  const store = useStore();
  const config = useConfig();
  const { mode } = useEditorMode();
  // @ts-expect-error: ConfigCommon to Config
  const pageId = getPageId(config);
  const dbValue = useMemo(() => ({ items: pageBlocks }), [pageBlocks]);

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
        />
      </EditorComponentProvider>
    </RootContainer>
  );
};
