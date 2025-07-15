import React, { useCallback } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { ServerStyleSheet } from "visual/providers/StyleProvider/ServerStyleSheet";
import { Store } from "visual/redux/store";
import { Block } from "visual/types/Block";
import { Providers } from "../controls/Providers";
import { baseToStatic } from "./baseToStatic";
import { Output } from "./types";

interface Props {
  block: Block;
  store: Store;
  config: ConfigCommon;
  editorMode: EditorMode;
}

const RenderPage = (props: {
  block: Block;
  store: Store;
  editorMode: EditorMode;
}) => {
  const { block, store, editorMode } = props;
  const { Page: BasePage } = EditorGlobal.getComponents();

  const config = useConfig();
  const getGlobalConfig = useCallback(() => config, [config]);

  if (!BasePage) {
    throw Error("Missing Page Components", EditorGlobal.getComponents());
  }
  const reduxState = store.getState();
  const dbValue = {
    items: [block]
  };

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

export const blockToStatic = (props: Props): Output => {
  const { block, store, config, editorMode } = props;
  const sheet = new ServerStyleSheet();

  const Page = (
    <Providers
      store={store}
      sheet={sheet.instance}
      config={config}
      editorMode={editorMode}
    >
      <RenderPage block={block} store={store} editorMode={editorMode} />
    </Providers>
  );

  return baseToStatic({ Page, sheet: sheet.instance, store, config });
};
