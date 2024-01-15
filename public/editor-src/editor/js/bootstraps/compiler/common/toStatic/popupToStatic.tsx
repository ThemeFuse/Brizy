import classnames from "classnames";
import React from "react";
import { Root } from "visual/component/Root";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { projectClassName } from "../utils/projectClassName";
import { baseToStatic } from "./baseToStatic";

interface Props {
  store: Store;
  config: ConfigCommon;
}

export const popupToStatic = async (props: Props) => {
  const { store, config } = props;
  const { PagePopup } = EditorGlobal.getComponents();

  if (!PagePopup) {
    throw Error("Missing PagePopup Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const dbValue = pageDataDraftBlocksSelector(reduxState);
  const className = classnames("brz", projectClassName(config));

  const Page = (
    <Root type="popup">
      {/* @ts-expect-error: Missing optional props */}
      <PagePopup
        className={className}
        dbValue={dbValue}
        reduxState={reduxState}
      />
    </Root>
  );

  return await baseToStatic({ store, Page, config });
};
