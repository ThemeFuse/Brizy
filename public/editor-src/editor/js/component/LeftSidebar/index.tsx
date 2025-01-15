import classnames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import PointerEvents from "visual/component/PointerEvents";
import { isCloud } from "visual/global/Config/types";
import { isStory } from "visual/global/EditorModeContext";
import { useConfig, useEditorMode } from "visual/global/hooks";
import { updateUI } from "visual/redux/actions2";
import {
  deviceModeSelector,
  leftSidebarSelector
} from "visual/redux/selectors";
import DrawerOptions from "./components/Options";
import { getOptions } from "./options";

export const LeftSidebar = (): ReactElement => {
  const dispatch = useDispatch();
  const deviceMode = useSelector(deviceModeSelector);
  const editorMode = useEditorMode();

  const config = useConfig();

  const { drawerContentType, isOpen } = useSelector(leftSidebarSelector);

  const handleClickOutside = useCallback(
    () =>
      drawerContentType &&
      dispatch(
        updateUI("leftSidebar", {
          drawerContentType: null,
          isOpen: false
        })
      ),
    [drawerContentType, dispatch]
  );

  const { top, bottom } = useMemo(() => {
    return getOptions(config, deviceMode, editorMode);
  }, [config, deviceMode, editorMode]);

  const opened = drawerContentType === "cmsUi" && isOpen;

  const _isStory = isStory(editorMode);
  const leftSidebarCssV2 = useMemo(() => {
    return isCloud(config) && !_isStory;
  }, [config, _isStory]);

  return (
    <ClickOutside
      onClickOutside={handleClickOutside}
      exceptions={[
        ".brz-ed-sortable--empty",
        ".brz-ed-toolbar",
        ".brz-ed-fixed-bottom-panel",
        ".brz-ed-animated",
        ".brz-ed-eyeDropper",
        ".brz-ui-modal-wrap",
        ".brz-ui-modal-mask"
      ]}
    >
      <PointerEvents>
        <div id="brz-ed-sidebar" className="brz-ed-sidebar">
          <div
            className={classnames("brz-ed-sidebar__control", {
              "brz-ed-sidebar__control-cms": leftSidebarCssV2,
              "brz-ed-sidebar__control-cms__opened": leftSidebarCssV2 && opened
            })}
          >
            <DrawerOptions
              className="brz-ed-sidebar__control--top"
              data={top}
            />
            <DrawerOptions
              className="brz-ed-sidebar__control--bottom"
              data={bottom}
            />
          </div>
        </div>
      </PointerEvents>
    </ClickOutside>
  );
};
