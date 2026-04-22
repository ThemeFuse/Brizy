import classnames from "classnames";
import React, { ReactElement, RefObject, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import { SidebarWrapper } from "visual/component/LeftSidebar/components/Drawer";
import PointerEvents from "visual/component/PointerEvents";
import { isCloud } from "visual/global/Config/types";
import {
  usePluginDrawerOptions,
  usePluginTabOptions
} from "visual/plugins/PluginProvider";
import { useConfig } from "visual/providers/ConfigProvider";
import { isStory, useEditorMode } from "visual/providers/EditorModeProvider";
import { updateUI } from "visual/redux/actions2";
import {
  deviceModeSelector,
  drawerContentTypeSelector
} from "visual/redux/selectors";
import { attachRefs } from "visual/utils/react";
import DrawerOptions from "./components/Options";
import { getOptions } from "./options";

const exceptions = [
  ".brz-ed-sortable--empty",
  ".brz-ed-toolbar",
  ".brz-ed-fixed-bottom-panel",
  ".brz-ed-animated",
  ".brz-ed-eyeDropper",
  ".brz-ui-v2-modal-wrap",
  ".brz-ui-v2-modal-mask"
];

export const LeftSidebar = (): ReactElement => {
  const config = useConfig();
  const dispatch = useDispatch();
  const { mode: editorMode } = useEditorMode();
  const deviceMode = useSelector(deviceModeSelector);
  const drawerContentType = useSelector(drawerContentTypeSelector);

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

  const pluginDrawerOptions = usePluginDrawerOptions();
  const pluginTabOptions = usePluginTabOptions();

  const topWithPlugins = useMemo(
    () => [...top, ...pluginDrawerOptions, ...pluginTabOptions.top],
    [top, pluginDrawerOptions, pluginTabOptions.top]
  );

  const bottomWithPlugins = useMemo(
    () => [...bottom, ...pluginTabOptions.bottom],
    [bottom, pluginTabOptions.bottom]
  );

  const leftSidebarDrawerOptions = useMemo(
    () =>
      [...top, ...pluginDrawerOptions, ...bottom].filter(
        (i) => i.type === "drawer"
      ),
    [top, pluginDrawerOptions, bottom]
  );

  const _isStory = isStory(editorMode);
  const leftSidebarCssV2 = useMemo(() => {
    return isCloud(config) && !_isStory;
  }, [config, _isStory]);

  return (
    <ClickOutside onClickOutside={handleClickOutside} exceptions={exceptions}>
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
                  data={topWithPlugins}
                />
                <DrawerOptions
                  className="brz-ed-sidebar__control--bottom"
                  data={bottomWithPlugins}
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
