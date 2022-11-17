import React, { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { updateUI } from "visual/redux/actions2";
import { showHiddenElementsSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { IS_STORY } from "visual/utils/models";
import { BottomPanelItem } from "./Item";

function HiddenElementsToggle(): ReactNode {
  const dispatch = useDispatch();
  const showHiddenElements = useSelector(showHiddenElementsSelector);

  // ! write less hacky later
  if (IS_STORY) {
    return null;
  }

  const icon = showHiddenElements ? "nc-eye-17" : "nc-eye-ban-18";
  const title = showHiddenElements
    ? t("Hide Hidden Elements")
    : t("Show Hidden Elements");

  return (
    <BottomPanelItem
      paddingSize="medium"
      active={true}
      pointer={true}
      title={title}
      onClick={(): void => {
        dispatch(updateUI("showHiddenElements", !showHiddenElements));
      }}
    >
      <EditorIcon icon={icon} />
    </BottomPanelItem>
  );
}

export default HiddenElementsToggle;
