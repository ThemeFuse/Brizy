import React, { ReactElement, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import { CLEAR_ITEMS_TIMEOUT } from "visual/component/RightSidebar/utils";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import { applyFilter } from "visual/utils/filters";
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
    // A plugin (e.g. the AI support chat) may claim the Help action by
    // returning `true`. If none does, fall back to the Help (videos) sidebar.
    if (applyFilter("editor.helpButton.click", false)) {
      return;
    }

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
        exceptions={applyFilter(
          "toolbar.clickOutsideExceptions",
          clickOutsideExceptions
        )}
      >
        {({ ref }) => <EditorIcon icon={"nc-help"} ref={ref} />}
      </ClickOutside>
    </BottomPanelItem>
  );
};

export default HelpButton;
