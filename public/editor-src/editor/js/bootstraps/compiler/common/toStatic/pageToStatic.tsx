import React from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { ServerStyleSheet } from "visual/providers/StyleProvider/ServerStyleSheet";
import { pageBlocksRawSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Providers } from "../controls/Providers";
import { Root } from "../controls/Root";
import { baseToStatic } from "./baseToStatic";
import { Output } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
  hasGlobalBlocks: boolean;
  editorMode: EditorMode;
}

const RenderPage = (props: { store: Store; editorMode: EditorMode }) => {
  const { store, editorMode } = props;
  const { Page: BasePage } = EditorGlobal.getComponents();

  if (!BasePage) {
    throw Error("Missing Page Components", EditorGlobal.getComponents());
  }
  const reduxState = store.getState();

  const pageBlocks = pageBlocksRawSelector(reduxState);
  const dbValue = {
    items: pageBlocks
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
      />
    </>
  );
};

export const pageToStatic = (props: Props): Output => {
  const { store, hasGlobalBlocks, config, editorMode } = props;
  const sheet = new ServerStyleSheet();

  const Page = (
    <Providers
      store={store}
      sheet={sheet.instance}
      config={config}
      editorMode={editorMode}
    >
      <Root className="brz" type="page" hasGlobalBlocks={hasGlobalBlocks}>
        <RenderPage store={store} editorMode={editorMode} />
      </Root>
    </Providers>
  );

  return baseToStatic({ Page, sheet: sheet.instance, store });
};
