import { noop } from "es-toolkit";
import React, { useCallback } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { Model } from "visual/editorComponents/EditorComponent/types";
import GlobalBlock from "visual/editorComponents/GlobalBlock";
import type {
  OwnProps as GlobalBlockOwnProps,
  Value as GlobalBlockValue
} from "visual/editorComponents/GlobalBlock/types";
import { useConfig } from "visual/providers/ConfigProvider";
import { useEditorMode } from "visual/providers/EditorModeProvider";
import type { ReduxAction } from "visual/redux/actions2";
import {
  currentOverlayGlobalBlockSelector,
  stateSelector
} from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types";
import { createGlobalBlockSymbol } from "visual/utils/blocks";
import { areStatesEqual } from "./Editor/utils";

// Hoisted so the props keep the same reference across renders.
const EMPTY_ATTRIBUTES: GlobalBlockOwnProps["attributes"] = {};
const EMPTY_DEFAULT_VALUE: Model<GlobalBlockValue> = {};
const EMPTY_PATH: string[] = [];

export const GlobalBlocksOverlays = (): JSX.Element => {
  const dispatch = useDispatch();
  const state = useSelector(stateSelector, areStatesEqual);
  const store = useStore<ReduxState, ReduxAction>();
  const config = useConfig();
  const { mode } = useEditorMode();
  const overlay = useSelector((s: ReduxState) =>
    currentOverlayGlobalBlockSelector(s, config)
  );

  const getGlobalConfig = useCallback(() => config, [config]);

  if (!overlay) {
    return <div id="brz-overlays" />;
  }

  const { uid } = overlay;
  const { value } = createGlobalBlockSymbol({ uid });

  return (
    <>
      <div id="brz-overlays" />
      <GlobalBlock
        key={uid}
        _id={uid}
        dbValue={value}
        attributes={EMPTY_ATTRIBUTES}
        onChange={noop}
        reduxState={state}
        reduxStore={store}
        reduxDispatch={dispatch}
        renderContext="editor"
        editorMode={mode}
        getGlobalConfig={getGlobalConfig}
        defaultValue={EMPTY_DEFAULT_VALUE}
        path={EMPTY_PATH}
        extendParentToolbar={noop}
      />
    </>
  );
};
