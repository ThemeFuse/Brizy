import React, { ReactElement, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import { CLEAR_ITEMS_TIMEOUT } from "visual/component/RightSidebar/utils";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { BottomPanelItem } from "./Item";
import { clickOutsideExceptions } from "./utils";

let timeoutId = 0;

const HelpButton = (): ReactElement => {
  const { rightSidebar } = useSelector(uiSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleLabelClick = useCallback(() => {
    dispatch(
      updateUI("rightSidebar", {
        ...rightSidebar,
        isOpen: true,
        type: "help"
      })
    );
  }, [dispatch, rightSidebar]);

  const onClickOutside = useCallback(() => {
    timeoutId = window.setTimeout(() => {
      if (rightSidebar.type === "help") {
        dispatch(
          updateUI("rightSidebar", {
            ...rightSidebar,
            isOpen: rightSidebar.lock === "manual",
            type: "options"
          })
        );
      }
    }, CLEAR_ITEMS_TIMEOUT + 1);
  }, [dispatch, rightSidebar]);

  return (
    <BottomPanelItem
      paddingSize="medium"
      active
      pointer
      title={t("Help")}
      onClick={handleLabelClick}
    >
      <ClickOutside
        onClickOutside={onClickOutside}
        exceptions={clickOutsideExceptions}
      >
        {({ ref }) => <EditorIcon icon={"nc-help"} ref={ref} />}
      </ClickOutside>
    </BottomPanelItem>
  );
};

export default HelpButton;
