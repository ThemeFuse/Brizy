import React from "react";
import { useDispatch, useSelector } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import EditorIcon from "visual/component/EditorIcon";
import { undo } from "visual/redux/actions2";
import { ReduxStateWithHistory } from "visual/redux/types";
import { BottomPanelItem } from "./Item";
import { t } from "visual/utils/i18n";

type History = ReduxStateWithHistory["history"];

export const UndoButton: React.FC = () => {
  const canUndo = useSelector<ReduxStateWithHistory, History["canUndo"]>(
    (state) => state.history.canUndo
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
        title={t("Undo (ctrl+Z)")}
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
