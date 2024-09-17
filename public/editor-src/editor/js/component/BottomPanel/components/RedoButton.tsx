import React from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import { redo } from "visual/redux/actions2";
import { ReduxStateWithHistory } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import { BottomPanelItem } from "./Item";

type History = ReduxStateWithHistory["history"];

export const RedoButton = (): JSX.Element => {
  const canRedo = useSelector<ReduxStateWithHistory, History["canRedo"]>(
    (state) => state.history.canRedo
  );
  const dispatch = useDispatch();

  const handleRedo = (): void => {
    dispatch(redo());
  };

  return (
    <>
      <BottomPanelItem
        paddingSize="medium"
        active={canRedo}
        pointer={canRedo}
        title={t("Redo (ctrl+shift+Z)")}
        onClick={handleRedo}
      >
        <EditorIcon icon="nc-redo" />
      </BottomPanelItem>
      <HotKeys
        keyNames={["ctrl+shift+Z", "cmd+shift+Z"]}
        id="key-helper-redo"
        onKeyDown={handleRedo}
      />
    </>
  );
};
