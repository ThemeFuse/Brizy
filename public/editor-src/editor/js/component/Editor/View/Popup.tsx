import React from "react";
import { useSelector } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { Root } from "visual/component/Root";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";

export const Popup = () => {
  const { PagePopup } = EditorGlobal.getComponents();
  const dbValue = useSelector(pageDataDraftBlocksSelector);
  const state = useSelector<ReduxState, ReduxState>((state) => state);

  if (!PagePopup) {
    return <div>{t("Missing PagePopup Components")}</div>;
  }

  return (
    <Root type="popup">
      {/* @ts-expect-error: Missing EditorComponent props */}
      <PagePopup dbValue={dbValue} reduxState={state} />
    </Root>
  );
};
