import React from "react";
import { useSelector, useDispatch } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import EditorIcon from "visual/component/EditorIcon";
import { undo } from "visual/redux/actions2";
import { ReduxStateWithHistory } from "visual/redux/types";
import { BottomPanelItem } from "./Item";

type History = ReduxStateWithHistory["history"];

export const UndoButton: React.FC = () => {
  const canUndo = useSelector<ReduxStateWithHistory, History["canUndo"]>(
    state => state.history.canUndo
  );
  const dispatch = useDispatch();

  const handleUndo = (): void => {
    dispatch(undo());
  };

  return (
    <>
      <BottomPanelItem
        paddingSize="medium"
        active={canUndo}
        pointer={canUndo}
        title="Undo (CTRL+Z)"
        onClick={handleUndo}
      >
        <EditorIcon icon="nc-undo" />
      </BottomPanelItem>
      <HotKeys
        keyNames={["ctrl+Z", "cmd+Z"]}
        id="key-helper-undo"
        onKeyDown={handleUndo}
      />
    </>
  );
};
