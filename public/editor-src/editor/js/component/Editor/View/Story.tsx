import React from "react";
import { useSelector } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { Root } from "visual/component/Root";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";

export const Story = () => {
  const { PageStory } = EditorGlobal.getComponents();
  const dbValue = useSelector(pageDataDraftBlocksSelector);
  const state = useSelector<ReduxState, ReduxState>((state) => state);

  if (!PageStory) {
    return <div>{t("Missing PageStory Components")}</div>;
  }

  return (
    <Root className="brz" type="story">
      {/* @ts-expect-error: Missing EditorComponent props */}
      <PageStory dbValue={dbValue} reduxState={state} />
    </Root>
  );
};
