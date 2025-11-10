import React, { useCallback } from "react";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import type { EditorMode } from "visual/providers/EditorModeProvider";
import { ServerStyleSheet } from "visual/providers/StyleProvider/ServerStyleSheet";
import type { Store } from "visual/redux/store";
import type { GlobalBlockNormal } from "visual/types/GlobalBlock";
import { Providers } from "../controls/Providers";
import type { SymbolAsset } from "../transforms/assets/makeSymbols";
import { baseToStatic } from "./baseToStatic";
import type { GlobalBlockStatic } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
  compiledBlocks: Array<GlobalBlockNormal>;
  editorMode: EditorMode;
}

interface GlobalBlocksOutput {
  outputs: Array<GlobalBlockStatic>;
  symbols: SymbolAsset[];
}

const RenderPage = (props: {
  store: Store;
  editorMode: EditorMode;
  dbValue: ElementModel;
}) => {
  const { store, editorMode, dbValue } = props;
  const { Page: BasePage } = EditorGlobal.getComponents();

  const config = useConfig();
  const getGlobalConfig = useCallback(() => config, [config]);

  if (!BasePage) {
    throw Error("Missing Page Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();

  return (
    <>
      {/* @ts-expect-error: Missing optional props */}
      <BasePage
        dbValue={dbValue}
        reduxStore={store}
        reduxState={reduxState}
        renderContext="view"
        editorMode={editorMode}
        getGlobalConfig={getGlobalConfig}
      />
    </>
  );
};

export const globalBlocksToStatic = (props: Props): GlobalBlocksOutput => {
  const { store, compiledBlocks, config, editorMode } = props;
  const pageBlocks = compiledBlocks.map((block) => ({
    uid: block.uid,
    data: block.data
  }));
  const outputs: GlobalBlocksOutput["outputs"] = [];
  const symbols: SymbolAsset[] = [];

  for (const block of pageBlocks) {
    const sheet = new ServerStyleSheet();
    const items = [block.data];
    const dbValue = { items };

    const Page = (
      <Providers
        store={store}
        sheet={sheet.instance}
        config={config}
        editorMode={editorMode}
      >
        <RenderPage store={store} dbValue={dbValue} editorMode={editorMode} />
      </Providers>
    );

    try {
      const output = baseToStatic({
        Page,
        store,
        sheet: sheet.instance,
        config
      });

      symbols.push(...output.symbols);
      outputs.push({
        uid: block.uid,
        blocks: [{ id: block.uid, ...output }]
      });
    } catch (e) {
      console.error("Fail to compile globalBLock", e);
    }
  }

  return { outputs, symbols };
};
