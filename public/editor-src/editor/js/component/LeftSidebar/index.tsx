import classnames from "classnames";
import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import PointerEvents from "visual/component/PointerEvents";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types";
import { updateUI } from "visual/redux/actions2";
import { leftSidebarSelector } from "visual/redux/selectors";
import { isStory } from "visual/utils/models/modes";
import DrawerOptions from "./components/Options";
import { getOptions } from "./options";

export const LeftSidebar: FC = () => {
  const dispatch = useDispatch();

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
  const config = useMemo(() => {
    return Config.getAll();
  }, []);

  const { top, bottom } = useMemo(() => {
    return getOptions(config);
  }, [config]);

  const opened = drawerContentType === "cmsUi" && isOpen;

  const leftSidebarCssV2 = useMemo(() => {
    return isCloud(config) && !isStory(config);
  }, [config]);

  return (
    <ClickOutside
      onClickOutside={handleClickOutside}
      exceptions={[
        ".brz-ed-sortable--empty",
        ".brz-ed-toolbar",
        ".brz-ed-fixed-bottom-panel",
        ".brz-ed-animated",
        ".brz-ed-eyeDropper"
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
