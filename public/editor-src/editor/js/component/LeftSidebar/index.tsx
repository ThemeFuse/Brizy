import classnames from "classnames";
import React, { ReactElement, RefObject, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import { SidebarWrapper } from "visual/component/LeftSidebar/components/Drawer";
import PointerEvents from "visual/component/PointerEvents";
import { isCloud } from "visual/global/Config/types";
import { useConfig } from "visual/providers/ConfigProvider";
import { isStory, useEditorMode } from "visual/providers/EditorModeProvider";
import { updateUI } from "visual/redux/actions2";
import {
  deviceModeSelector,
  drawerContentTypeSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { attachRefs } from "visual/utils/react";
import DrawerOptions from "./components/Options";
import { getOptions } from "./options";

export const LeftSidebar = (): ReactElement => {
  const config = useConfig();
  const dispatch = useDispatch();
  const { mode: editorMode } = useEditorMode();
  const { deviceMode, drawerContentType } = useSelector(
    (state: ReduxState) => ({
      deviceMode: deviceModeSelector(state),
      drawerContentType: drawerContentTypeSelector(state)
    })
  );

  const handleClickOutside = useCallback(
    () =>
      drawerContentType &&
      dispatch(
        updateUI("leftSidebar", {
          drawerContentType: null
        })
      ),
    [drawerContentType, dispatch]
  );

  const { top, bottom } = useMemo(() => {
    return getOptions(config, deviceMode, editorMode);
  }, [config, deviceMode, editorMode]);

  const leftSidebarDrawerOptions = useMemo(
    () => [...top, ...bottom].filter((i) => i.type === "drawer"),
    [top, bottom]
  );

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
        ".brz-ui-v2-modal-wrap",
        ".brz-ui-v2-modal-mask"
      ]}
    >
      {({ ref }) => (
        <PointerEvents>
          {({ ref: pointerEventsRef }: { ref: RefObject<HTMLDivElement> }) => (
            <div
              id="brz-ed-sidebar"
              className="brz-ed-sidebar"
              ref={(el) => {
                attachRefs(el, [ref, pointerEventsRef]);
              }}
            >
              <div
                className={classnames("brz-ed-sidebar__control", {
                  "brz-ed-sidebar__control-cms": leftSidebarCssV2
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
              <SidebarWrapper options={leftSidebarDrawerOptions} />
            </div>
          )}
        </PointerEvents>
      )}
    </ClickOutside>
  );
};
