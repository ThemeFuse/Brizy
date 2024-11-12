import React from "react";
import { useSelector } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import { pageBlocksRawSelector } from "visual/redux/selectors";
import { Root } from "visual/component/Root";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";

export const Page = (): JSX.Element => {
  const { Page: BasePage } = EditorGlobal.getComponents();
  const pageBlocks = useSelector(pageBlocksRawSelector);
  const state = useSelector<ReduxState, ReduxState>((state) => state);

  if (!BasePage) {
    return <div>{t("Missing Page Components")}</div>;
  }

  const dbValue = {
    items: pageBlocks
  };

  return (
    <Root className="brz" type="page">
      {/* @ts-expect-error: Missing EditorComponent props */}
      <BasePage dbValue={dbValue} reduxState={state} />
    </Root>
  );
};
