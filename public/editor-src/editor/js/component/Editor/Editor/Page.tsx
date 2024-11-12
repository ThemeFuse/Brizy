import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DraggableOverlay } from "visual/component/DraggableOverlay";
import { Root } from "visual/component/Root";
import EditorGlobal from "visual/global/Editor";
import { updateBlocks } from "visual/redux/actions2";
import {
  pageDataDraftBlocksSelector,
  stateSelector
} from "visual/redux/selectors";
import { areStatesEqual } from "../utils";
import { t } from "visual/utils/i18n";

const Page = (): JSX.Element => {
  const dispatch = useDispatch();
  const state = useSelector(stateSelector, areStatesEqual);

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
    <Root>
      {/* @ts-expect-error: Missing EditorComponent props */}
      <Page
        dbValue={pageData}
        reduxState={state}
        reduxDispatch={dispatch}
        onChange={handlePageChange}
      />
      <DraggableOverlay />
    </Root>
  );
};

export default Page;
