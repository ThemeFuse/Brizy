import React from "react";
import { useSelector, useDispatch } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import EditorIcon from "visual/component/EditorIcon";
import { redo } from "visual/redux/actions2";
import { ReduxStateWithHistory } from "visual/redux/types";
import { BottomPanelItem } from "./Item";

type History = ReduxStateWithHistory["history"];

export const RedoButton: React.FC = () => {
  const canRedo = useSelector<ReduxStateWithHistory, History["canRedo"]>(
    state => state.history.canRedo
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
        title="Redo (CTRL+SHIFT+Z)"
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
