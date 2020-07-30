import React from "react";
import { useSelector, useDispatch } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { undo } from "visual/redux/actions2";
import { ReduxStateWithHistory } from "visual/redux/types";

export const UndoButton: React.FC = () => {
  const canUndo = useSelector<ReduxStateWithHistory>(
    state => state.history.canUndo
  );
  const dispatch = useDispatch();
  const className = classnames("brz-li brz-ed-fixed-bottom-panel__item", {
    active: canUndo
  });

  const handleUndo = (): void => {
    dispatch(undo());
  };

  return (
    <>
      <li className={className} title="Undo (CTRL+Z)" onClick={handleUndo}>
        <EditorIcon icon="nc-undo" />
      </li>
      <HotKeys
        keyNames={["ctrl+Z", "cmd+Z"]}
        id="key-helper-undo"
        onKeyDown={handleUndo}
      />
    </>
  );
};
