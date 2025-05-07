import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { RootContainer } from "visual/component/RootContainer";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorComponentProvider } from "visual/providers/EditorComponentProvider";
import { useEditorMode } from "visual/providers/EditorModeProvider";
import { updateBlocks } from "visual/redux/actions2";
import { pageBlocksSelector, stateSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { areStatesEqual, getPageId } from "../utils";
import { OnChange } from "./types";

const Popup = (): JSX.Element => {
  const state = useSelector(stateSelector, areStatesEqual);
  const items = useSelector(pageBlocksSelector);
  const store = useStore();
  const dispatch = useDispatch();
  const config = useConfig();
  const { mode } = useEditorMode();
  // @ts-expect-error: ConfigCommon to Config
  const pageId = getPageId(config);
  const modulesGroup = config.dynamicContent?.groups;
  const { backgroundPreviewUrl } = config.ui?.popupSettings ?? {};

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

  useEffect(() => {
    document.body.classList.add("brz-ow-hidden", "brz-height--100vh");
  }, []);

  const { PagePopup } = EditorGlobal.getComponents();

  if (!PagePopup) {
    return <div>{t("Missing PagePopup Component")}</div>;
  }

  return (
    <>
      {items.length > 0 && backgroundPreviewUrl && (
        <iframe
          id="brz-ed-home-page"
          src={backgroundPreviewUrl}
          title="popup"
        />
      )}
      <RootContainer className="brz brz-ed">
        <EditorComponentProvider pageId={pageId} groups={groups}>
          {/* @ts-expect-error: Missing EditorComponent props */}
          <PagePopup
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

export default Popup;
