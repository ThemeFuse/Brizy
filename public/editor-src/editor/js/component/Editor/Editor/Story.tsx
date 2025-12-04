import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { RootContainer } from "visual/component/RootContainer";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { useEditorMode } from "visual/providers/EditorModeProvider";
import { useTranslation } from "visual/providers/I18nProvider";
import { ReduxAction, updateBlocks } from "visual/redux/actions2";
import { pageBlocksSelector, stateSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { areStatesEqual, getPageId } from "../utils";
import { OnChange } from "./types";

const Story = (): JSX.Element => {
  const state = useSelector(stateSelector, areStatesEqual);
  const items = useSelector(pageBlocksSelector);
  const store = useStore<ReduxState, ReduxAction>();
  const dispatch = useDispatch();
  const config = useConfig();
  const { mode } = useEditorMode();
  const { t } = useTranslation();
  const { pagePreview } = config.urls ?? {};
  // @ts-expect-error: ConfigCommon to Config
  const pageId = getPageId(config);
  const modulesGroup = config.dynamicContent?.groups;

  const groups = useMemo(() => modulesGroup, [modulesGroup]);
  const dbValue = useMemo(() => ({ items }), [items]);

  const getGlobalConfig = useCallback(() => config, [config]);

  const handlePageChange = useCallback<OnChange>(
    (model, meta) => {
      if (!model) {
        return;
      }

      const { items: blocks = [] } = model;
      // @ts-expect-error: TMP
      dispatch(updateBlocks({ blocks, meta, config }));
    },
    [config, dispatch]
  );

  const { PageStory } = EditorGlobal.getComponents();

  if (!PageStory) {
    return <div>{t("Missing PageStory Component")}</div>;
  }

  return (
    <>
      {items.length > 0 && (
        <iframe id="brz-ed-home-page" src={pagePreview} title="story" />
      )}
      <RootContainer className="brz brz-ed">
        <EditorComponentProvider pageId={pageId} groups={groups}>
          {/* @ts-expect-error: Missing EditorComponent props */}
          <PageStory
            dbValue={dbValue}
            reduxState={state}
            reduxStore={store}
            reduxDispatch={dispatch}
            onChange={handlePageChange}
            renderContext="editor"
            editorMode={mode}
            getGlobalConfig={getGlobalConfig}
          />
        </EditorComponentProvider>
      </RootContainer>
    </>
  );
};

export default Story;
