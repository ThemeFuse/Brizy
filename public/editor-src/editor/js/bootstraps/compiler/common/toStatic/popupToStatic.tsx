import React, { useCallback } from "react";
import { addFirst, getIn, setIn } from "timm";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { ServerStyleSheet } from "visual/providers/StyleProvider/ServerStyleSheet";
import { Store } from "visual/redux/store";
import { Block } from "visual/types/Block";
import { isExternalPopup, isInternalPopup } from "visual/utils/models";
import { compileProject } from "../compileProject";
import { Providers } from "../controls/Providers";
import { Asset } from "../transforms/assets";
import { projectClassName } from "../utils/projectClassName";
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
  className?: string;
}) => {
  const { block, store, editorMode, className } = props;
  const { PagePopup } = EditorGlobal.getComponents();

  const config = useConfig();
  const getGlobalConfig = useCallback(() => config, [config]);

  if (!PagePopup) {
    throw Error("Missing PagePopup Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const dbValue = {
    items: [block]
  };

  return (
    <>
      {/* @ts-expect-error: Missing optional props */}
      <PagePopup
        className={className}
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

export const popupToStatic = (props: Props): Output => {
  const { block, store, config, editorMode } = props;
  const isInternal = isInternalPopup(config);
  const isExternal = isExternalPopup(config);
  // if we add external popup to brizy page - his global styles rewrite page global styles
  const className = isExternal ? projectClassName(config) : undefined;
  const sheet = new ServerStyleSheet();

  const Page = (
    <Providers
      store={store}
      sheet={sheet.instance}
      config={config}
      editorMode={editorMode}
    >
      <RenderPage
        block={block}
        className={className}
        store={store}
        editorMode={editorMode}
      />
    </Providers>
  );

  const output = baseToStatic({ store, Page, sheet: sheet.instance, config });

  if (isInternal) {
    return output;
  }

  // For External Popup we need to embedded global css(pallet) inside pageStyles
  const projectAssets = compileProject(config, store);
  const pageStylesPath = ["assets", "freeStyles", "pageStyles"];
  const pageStyles = (getIn(output, pageStylesPath) ?? []) as Array<Asset>;
  const newPageStyles = addFirst(pageStyles, projectAssets);

  return setIn(
    output,
    ["assets", "freeStyles", "pageStyles"],
    newPageStyles
  ) as Output;
};
