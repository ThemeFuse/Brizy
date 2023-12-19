import React from "react";
import { useDispatch, useSelector } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import EditorIcon from "visual/component/EditorIcon";
import { redo } from "visual/redux/actions2";
import { ReduxStateWithHistory } from "visual/redux/types";
import { BottomPanelItem } from "./Item";
import { t } from "visual/utils/i18n";

type History = ReduxStateWithHistory["history"];

export const RedoButton: React.FC = () => {
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
