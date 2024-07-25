import React from "react";
import { Root } from "visual/component/Root";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { baseToStatic } from "./baseToStatic";

interface Props {
  store: Store;
  config: ConfigCommon;
}

export const storyToStatic = async (props: Props) => {
  const { store, config } = props;
  const { PageStory } = EditorGlobal.getComponents();

  if (!PageStory) {
    throw Error("Missing PageStory Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const dbValue = pageDataDraftBlocksSelector(reduxState);

  const Page = (
    <Root className="brz" type="story">
      {/* @ts-expect-error: Missing optional props */}
      <PageStory dbValue={dbValue} reduxState={reduxState} />
    </Root>
  );

  return await baseToStatic({ store, Page, config });
};
