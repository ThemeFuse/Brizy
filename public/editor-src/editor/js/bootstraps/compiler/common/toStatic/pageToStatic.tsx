import React from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { pageBlocksRawSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Root } from "../controls/Root";
import { baseToStatic } from "./baseToStatic";

interface Props {
  store: Store;
  config: ConfigCommon;
}

export const pageToStatic = async (props: Props) => {
  const { store, config } = props;
  const { Page: BasePage } = EditorGlobal.getComponents();

  if (!BasePage) {
    throw Error("Missing Page Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const pageBlocks = pageBlocksRawSelector(reduxState);
  const dbValue = {
    items: pageBlocks
  };

  const hasGlobalBlocks = Array.isArray(config.globalBlocks);

  const Page = (
    <Root className="brz" type="page" hasGlobalBlocks={hasGlobalBlocks}>
      {/* @ts-expect-error: Missing optional props */}
      <BasePage dbValue={dbValue} reduxState={reduxState} />
    </Root>
  );

  return await baseToStatic({ Page, store, config });
};
