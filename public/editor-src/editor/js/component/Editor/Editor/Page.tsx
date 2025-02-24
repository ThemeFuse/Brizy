import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { DraggableOverlay } from "visual/component/DraggableOverlay";
import { RootContainer } from "visual/component/RootContainer";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/global/hooks";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { useEditorMode } from "visual/providers/EditorModeProvider";
import { updateBlocks } from "visual/redux/actions2";
import {
  pageDataDraftBlocksSelector,
  stateSelector
} from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { areStatesEqual, getPageId } from "../utils";

const Page = (): JSX.Element => {
  const dispatch = useDispatch();
  const state = useSelector(stateSelector, areStatesEqual);
  const store = useStore();
  const config = useConfig();
  const { mode } = useEditorMode();
  // @ts-expect-error: ConfigCommon to Config
  const pageId = getPageId(config);
  const modulesGroup = config.dynamicContent?.groups;
  const groups = useMemo(() => modulesGroup, [modulesGroup]);

  const handlePageChange = useCallback(
    ({ items: blocks }, meta) => {
      dispatch(updateBlocks({ blocks, meta }));
    },
    [dispatch]
  );

  const { Page } = EditorGlobal.getComponents();
  const pageData = pageDataDraftBlocksSelector(state);

  if (!Page) {
    return <div>{t("Missing Page Component")}</div>;
  }

  return (
    <RootContainer className="brz brz-ed">
      <EditorComponentProvider pageId={pageId} groups={groups}>
        {/* @ts-expect-error: Missing EditorComponent props */}
        <Page
          dbValue={pageData}
          reduxState={state}
          reduxStore={store}
          reduxDispatch={dispatch}
          onChange={handlePageChange}
          renderContext="editor"
          editorMode={mode}
        />
        <DraggableOverlay />
      </EditorComponentProvider>
    </RootContainer>
  );
};

export default Page;
