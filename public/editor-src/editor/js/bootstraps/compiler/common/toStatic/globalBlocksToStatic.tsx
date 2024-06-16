import React from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { Store } from "visual/redux/store";
import { GlobalBlockNormal } from "visual/types";
import { Root } from "../controls/Root";
import { baseToStatic } from "./baseToStatic";
import { GlobalBlockStatic } from "./types";

interface Props {
  store: Store;
  compiledBlocks: Array<GlobalBlockNormal>;
  config: ConfigCommon;
}

type GlobalBlocksOutput = Array<GlobalBlockStatic>;

export const globalBlocksToStatic = async (
  props: Props
): Promise<GlobalBlocksOutput> => {
  const { store, config, compiledBlocks } = props;
  const { Page: BasePage } = EditorGlobal.getComponents();

  if (!BasePage) {
    throw Error("Missing Page Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const pageBlocks = compiledBlocks.map((block) => ({
    uid: block.uid,
    data: block.data
  }));
  const outputs: GlobalBlocksOutput = [];

  for (const block of pageBlocks) {
    const items = [block.data];
    const dbValue = { items };

    const Page = (
      <Root type="block">
        {/* @ts-expect-error: Missing optional props */}
        <BasePage className="brz" dbValue={dbValue} reduxState={reduxState} />
      </Root>
    );

    try {
      const output = await baseToStatic({ Page, store, config });
      outputs.push({ uid: block.uid, ...output });
    } catch (e) {
      console.error("Fail to compile globalBLock", e);
    }
  }

  return outputs;
};
