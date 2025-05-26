import React, { useCallback } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { ServerStyleSheet } from "visual/providers/StyleProvider/ServerStyleSheet";
import { pageBlocksRawSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Block } from "visual/types/Block";
import { Providers } from "../controls/Providers";
import { baseToStatic } from "./baseToStatic";
import { Output } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
  editorMode: EditorMode;
}

const RenderPage = (props: {
  store: Store;
  editorMode: EditorMode;
  block: Block;
}) => {
  const { store, editorMode, block } = props;
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

export const pageToStatic = (
  props: Props
): {
  rootClassNames: Array<string>;
  blocks: Array<Output & { id: string }>;
} => {
  const { store, config, editorMode } = props;
  const reduxState = store.getState();
  const pageBlocks = pageBlocksRawSelector(reduxState);
  const rootClassNames = [
    "brz brz-root__container brz-reset-all brz-root__container-page"
  ];
  const blocks = pageBlocks.map((block) => {
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

    return {
      id: block.value._id,
      ...baseToStatic({ Page, sheet: sheet.instance, store, config })
    };
  });

  return { rootClassNames, blocks };
};
