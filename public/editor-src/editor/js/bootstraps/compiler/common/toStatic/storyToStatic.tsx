import React from "react";
import { RootContainer } from "visual/component/RootContainer";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { ServerStyleSheet } from "visual/providers/StyleProvider/ServerStyleSheet";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Providers } from "../controls/Providers";
import { baseToStatic } from "./baseToStatic";
import { Output } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
  editorMode: EditorMode;
}

const RenderPage = (props: { store: Store; editorMode: EditorMode }) => {
  const { store, editorMode } = props;
  const { PageStory } = EditorGlobal.getComponents();

  if (!PageStory) {
    throw Error("Missing PageStory Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const dbValue = pageDataDraftBlocksSelector(reduxState);

  return (
    <>
      {/* @ts-expect-error: Missing optional props */}
      <PageStory
        dbValue={dbValue}
        reduxStore={store}
        reduxState={reduxState}
        renderContext="view"
        editorMode={editorMode}
      />
    </>
  );
};

export const storyToStatic = (props: Props): Output => {
  const { store, config, editorMode } = props;
  const sheet = new ServerStyleSheet();

  const Page = (
    <Providers
      store={store}
      sheet={sheet.instance}
      config={config}
      editorMode={editorMode}
    >
      <RootContainer className="brz">
        <RenderPage store={store} editorMode={editorMode} />
      </RootContainer>
    </Providers>
  );

  return baseToStatic({ store, Page, sheet: sheet.instance });
};
