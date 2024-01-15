import React from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { popupBlocksInPageSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Root } from "../controls/Root";
import { baseToStatic } from "./baseToStatic";
import { GlobalBlockStatic } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
}

type GlobalBlocksOutput = Array<GlobalBlockStatic>;

export const globalPopupsToStatic = async (
  props: Props
): Promise<GlobalBlocksOutput> => {
  const { store, config } = props;
  const { Page: BasePage } = EditorGlobal.getComponents();

  if (!BasePage) {
    throw Error("Missing Page Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const popupBlocks = popupBlocksInPageSelector(reduxState);
  const outputs: GlobalBlocksOutput = [];

  for (const block of popupBlocks) {
    const items = [block];
    const dbValue = { items };

    const Page = (
      <Root type="block">
        {/* @ts-expect-error: Missing optional props */}
        <BasePage className="brz" dbValue={dbValue} reduxState={reduxState} />
      </Root>
    );

    try {
      const output = await baseToStatic({ Page, store, config });
      outputs.push({ uid: block.value._id, ...output });
    } catch (e) {
      console.error("Fail to compile globalBLock", e);
    }
  }

  return outputs;
};
